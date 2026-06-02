-- Multi-Content OTT Platform Extension Migration

-- 1. Create content table
create table public.content (
  id text primary key,
  title text not null,
  type text not null check (type in ('movie', 'web_series', 'short_film', 'documentary', 'mockumentary', 'short_video')),
  year integer not null,
  runtime integer not null, -- in minutes
  genres text[] not null default '{}',
  moods text[] not null default '{}',
  atmosphere text not null check (atmosphere in ('horror', 'romance', 'sci-fi', 'drama', 'thriller', 'comedy', 'classic')),
  director text not null,
  cast text[] not null default '{}',
  synopsis text not null,
  tagline text not null,
  poster text, -- image url or css linear gradient
  banner text, -- image url
  trailer_id text, -- youtube trailer video id
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create ratings table
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references public.content(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_id, user_id)
);

-- 3. Create reviews table
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references public.content(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_id, user_id)
);

-- 4. Create reactions table (emoji timestamps for heatmap)
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references public.content(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  timestamp integer not null, -- offset in seconds during playback
  created_at timestamptz not null default now()
);

-- 5. Create analytics table (for trending content algorithms)
create table public.analytics (
  id uuid primary key default gen_random_uuid(),
  content_id text not null references public.content(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null default 'play' check (event_type in ('play', 'complete', 'pause', 'seek')),
  progress_pct integer not null default 0,
  ip_address text,
  created_at timestamptz not null default now()
);

-- 6. Enable Row Level Security (RLS)
alter table public.content enable row level security;
alter table public.ratings enable row level security;
alter table public.reviews enable row level security;
alter table public.reactions enable row level security;
alter table public.analytics enable row level security;

-- 7. Define RLS Policies

-- Content policies
create policy "Content is publicly readable" on public.content 
  for select using (true);
  
create policy "Admins can manage content" on public.content 
  for all using (public.has_role(auth.uid(), 'admin'::app_role)) 
  with check (public.has_role(auth.uid(), 'admin'::app_role));

-- Ratings policies
create policy "Ratings are publicly readable" on public.ratings 
  for select using (true);
  
create policy "Users can insert their own ratings" on public.ratings 
  for insert with check (auth.uid() = user_id);
  
create policy "Users can update their own ratings" on public.ratings 
  for update using (auth.uid() = user_id);
  
create policy "Users can delete their own ratings" on public.ratings 
  for delete using (auth.uid() = user_id);

-- Reviews policies
create policy "Reviews are readable" on public.reviews 
  for select using (status = 'approved' or auth.uid() = user_id or public.has_role(auth.uid(), 'admin'::app_role));
  
create policy "Users can insert their own reviews" on public.reviews 
  for insert with check (auth.uid() = user_id);
  
create policy "Users can update their own reviews" on public.reviews 
  for update using (auth.uid() = user_id);
  
create policy "Users can delete their own reviews" on public.reviews 
  for delete using (auth.uid() = user_id);
  
create policy "Admins can manage reviews" on public.reviews 
  for all using (public.has_role(auth.uid(), 'admin'::app_role)) 
  with check (public.has_role(auth.uid(), 'admin'::app_role));

-- Reactions policies
create policy "Reactions are publicly readable" on public.reactions 
  for select using (true);
  
create policy "Users can insert their own reactions" on public.reactions 
  for insert with check (auth.uid() = user_id);

-- Analytics policies
create policy "Admins can read all analytics" on public.analytics 
  for select using (public.has_role(auth.uid(), 'admin'::app_role));
  
create policy "Anyone can log analytics" on public.analytics 
  for insert with check (true);

-- 8. Triggers for updated_at
create trigger content_touch before update on public.content for each row execute function public.touch_updated_at();
create trigger ratings_touch before update on public.ratings for each row execute function public.touch_updated_at();
create trigger reviews_touch before update on public.reviews for each row execute function public.touch_updated_at();

-- 9. Indexes for Scalable Query Performance
create index idx_content_type on public.content(type);
create index idx_content_atmosphere on public.content(atmosphere);
create index idx_ratings_content_id on public.ratings(content_id);
create index idx_reviews_content_id on public.reviews(content_id);
create index idx_reviews_status on public.reviews(status);
create index idx_reactions_content_id_time on public.reactions(content_id, timestamp);
create index idx_analytics_content_id_created on public.analytics(content_id, created_at);

-- 10. Initial Seed Data (Movies, Web Series, Documentaries, Short Films, Mockumentaries, Short Videos)
insert into public.content (id, title, type, year, runtime, genres, moods, atmosphere, director, cast, synopsis, tagline, trailer_id, is_premium, poster, banner) values
('mv-001', 'Baahubali: The Beginning', 'movie', 2015, 159, '{Action,Epic,Drama}', '{mind-blowing,thriller-rush}', 'drama', 'S. S. Rajamouli', '{Prabhas,Rana Daggubati,Anushka Shetty}', 'Why did Kattappa kill Baahubali? A 2015 action / epic / drama feature directed by S. S. Rajamouli.', 'Why did Kattappa kill Baahubali?', 'sOEg_YZQsTI', false, null, null),
('mv-002', 'Baahubali 2: The Conclusion', 'movie', 2017, 167, '{Action,Epic,Drama}', '{mind-blowing,emotional}', 'drama', 'S. S. Rajamouli', '{Prabhas,Rana Daggubati,Anushka Shetty}', 'The conclusion of an empire. A 2017 action / epic / drama feature.', 'The conclusion of an empire.', 'G62HrubdD6o', false, null, null),
('mv-003', 'Salaar: Part 1 – Ceasefire', 'movie', 2023, 175, '{Action,Thriller}', '{thriller-rush,night-vibes}', 'thriller', 'Prashanth Neel', '{Prabhas,Prithviraj Sukumaran,Shruti Haasan}', 'A violent gang lord. A ceasefire that shouldn’t break.', 'A violent gang lord. A ceasefire that shouldn’t break.', 'BkVk5sPxgEI', false, null, null),
('mv-004', 'RRR', 'movie', 2022, 187, '{Action,Drama,Musical}', '{mind-blowing,happy,thriller-rush}', 'drama', 'S. S. Rajamouli', '{N. T. Rama Rao Jr.,Ram Charan,Alia Bhatt}', 'Rise. Roar. Revolt. A 2022 epic directed by Rajamouli.', 'Rise. Roar. Revolt.', 'f_vbAtFSEc0', false, null, null),
('mv-005', 'KGF: Chapter 1', 'movie', 2018, 156, '{Action,Crime}', '{thriller-rush,night-vibes}', 'thriller', 'Prashanth Neel', '{Yash,Srinidhi Shetty}', 'A boy. An empire of gold. Curated by the projectionist.', 'A boy. An empire of gold.', '_3kxbRR1HuE', false, null, null),
('mv-006', 'KGF: Chapter 2', 'movie', 2022, 168, '{Action,Crime}', '{thriller-rush,mind-blowing}', 'thriller', 'Prashanth Neel', '{Yash,Sanjay Dutt,Raveena Tandon}', 'The rise of a monster. Rocky takes over the gold empire.', 'The rise of a monster.', 'JKa05nyUmuQ', false, null, null),
('mv-007', 'Pushpa: The Rise', 'movie', 2021, 179, '{Action,Crime,Drama}', '{thriller-rush,night-vibes}', 'thriller', 'Sukumar', '{Allu Arjun,Rashmika Mandanna}', 'A flower with a thorn. Pushpa Raj smuggles red sandalwood.', 'A flower with a thorn.', 'pKctjlxbFDA', false, null, null),
('mv-008', 'Kantara', 'movie', 2022, 150, '{Action,Drama,Thriller}', '{mind-blowing,emotional}', 'drama', 'Rishab Shetty', '{Rishab Shetty,Sapthami Gowda}', 'A legend. A land. A reckoning. Demystifying forest traditions.', 'A legend. A land. A reckoning.', '9KR4ie-aN1Y', false, null, null),
('mv-009', '3 Idiots', 'movie', 2009, 170, '{Comedy,Drama}', '{happy,comfort-watch,emotional}', 'comedy', 'Rajkumar Hirani', '{Aamir Khan,R. Madhavan,Sharman Joshi}', 'Aal izz well. Friends seek out their long lost college buddy.', 'Aal izz well.', 'xvszmNXdM4w', false, null, null),
('mv-010', 'Dangal', 'movie', 2016, 161, '{Biography,Drama,Sport}', '{emotional,happy}', 'drama', 'Nitesh Tiwari', '{Aamir Khan,Fatima Sana Shaikh,Sanya Malhotra}', 'A father trains his daughters for the Commonwealth Games.', 'Mhaari chhoriyaan chhoron se kam hain ke?', 'x_7YlGv9u1g', false, null, null),
('mv-011', 'Tumbbad', 'movie', 2018, 104, '{Fantasy,Horror,Mystery}', '{rainy-mood,night-vibes,thriller-rush}', 'horror', 'Rahi Anil Barve', '{Sohum Shah,Jyoti Malshe}', 'Greed has a shape. A mythological horror centered on Hastar.', 'Greed has a shape.', '5fPCkN1WQEs', false, null, null),
('mv-012', 'Zindagi Na Milegi Dobara', 'movie', 2011, 155, '{Comedy,Drama,Adventure}', '{happy,comfort-watch}', 'comedy', 'Zoya Akhtar', '{Hrithik Roshan,Farhan Akhtar,Abhay Deol}', 'Three friends go on a road trip in Spain.', 'You won’t live this life again.', 'FJrpcDgC3zU', false, null, null),
('mv-013', 'Inception', 'movie', 2010, 148, '{Action,Sci-Fi,Thriller}', '{mind-blowing,night-vibes}', 'sci-fi', 'Christopher Nolan', '{Leonardo DiCaprio,Joseph Gordon-Levitt}', 'Your mind is the scene of the crime.', 'Your mind is the scene of the crime.', 'YoHD9XEInc0', true, null, null),
('mv-014', 'The Dark Knight', 'movie', 2008, 152, '{Action,Crime,Drama}', '{thriller-rush,mind-blowing}', 'thriller', 'Christopher Nolan', '{Christian Bale,Heath Ledger}', 'Welcome to a world without rules. The Joker unleashes chaos.', 'Welcome to a world without rules.', 'EXeTwQWrcwY', false, null, null),
('mv-015', 'Interstellar', 'movie', 2014, 169, '{Adventure,Drama,Sci-Fi}', '{mind-blowing,emotional,lonely}', 'sci-fi', 'Christopher Nolan', '{Matthew McConaughey,Anne Hathaway}', 'Mankind was born on Earth. It was never meant to die here.', 'Mankind was born on Earth. It was never meant to die here.', 'zSWdZVtXT7E', true, null, null),

-- Web Series
('ws-001', 'Sacred Games', 'web_series', 2018, 45, '{Crime,Drama,Thriller}', '{night-vibes,thriller-rush}', 'thriller', 'Anurag Kashyap & Vikramaditya Motwane', '{Saif Ali Khan,Nawazuddin Siddiqui,Radhika Apte}', 'A link in their pasts leads an honest cop to a fugitive gang boss who makes a warning to save the city.', 'Do you believe in God?', '28j8h0R5AWA', false, null, null),
('ws-002', 'Mirzapur', 'web_series', 2018, 50, '{Action,Crime,Drama}', '{thriller-rush,night-vibes}', 'thriller', 'Karan Anshuman', '{Pankaj Tripathi,Ali Fazal,Divyenndu}', 'A shocking incident at a wedding procession ignites a series of events in the lives of two families.', 'Rules are for fools.', 'ZNeGF-PvRHY', true, null, null),
('ws-003', 'The Family Man', 'web_series', 2019, 47, '{Action,Comedy,Drama}', '{happy,thriller-rush}', 'comedy', 'Raj & DK', '{Manoj Bajpayee,Sharib Hashmi,Priyamani}', 'A middle-class man secretly works as an intelligence officer for the National Investigation Agency.', 'A double life is twice as dangerous.', 'XatRGut65VI', false, null, null),

-- Documentaries
('doc-001', 'House of Secrets: The Burari Deaths', 'documentary', 2021, 135, '{Documentary,Crime,Mystery}', '{mind-blowing,emotional,night-vibes}', 'drama', 'Leena Yadav', '{Feroz Khan}', 'Suicide, murder or something else? This docu-series examines the chilling truths behind the deaths of 11 members of a family.', 'The walls have ears. The diaries have secrets.', '2bH2S4b2Qy8', false, null, null),
('doc-002', 'The Elephant Whisperers', 'documentary', 2022, 41, '{Documentary,Short}', '{happy,emotional,comfort-watch}', 'classic', 'Kartiki Gonsalves', '{Bomman,Bellie}', 'An indigenous couple falls in love with an orphaned baby elephant entrusted to their care.', 'Love speaks all languages.', 'V5R15T63Y32', false, null, null),
('doc-003', 'Wild Karnataka', 'documentary', 2019, 52, '{Documentary,Nature}', '{happy,comfort-watch}', 'classic', 'Amoghavarsha J. S.', '{David Attenborough}', 'A beautiful documentary exploring the rich biodiversity and wildlife of the southern state of Karnataka.', 'Nature like you have never seen it before.', 'j2c02mK3m11', false, null, null),

-- Short Films
('sf-001', 'Chutney', 'short_film', 2016, 17, '{Drama,Thriller}', '{mind-blowing,rainy-mood}', 'thriller', 'Jyoti Kapur Das', '{Tisca Chopra,Adil Hussain,Rasika Dugal}', 'A simple housewife reveals a dark and unsettling secret over chutney and pakoras.', 'Tasty. Tangy. Terrifying.', '9e80e1A52G1', false, null, null),
('sf-002', 'Ahalya', 'short_film', 2015, 14, '{Mystery,Fantasy,Thriller}', '{night-vibes,mind-blowing}', 'horror', 'Sujoy Ghosh', '{Radhika Apte,Soumitra Chatterjee}', 'A young police officer investigates a case that leads him to a sculptor with a mystical stone.', 'Do not touch the stone.', 'h3V90a5F3T1', false, null, null),

-- Mockumentaries
('mock-001', 'The Office (India)', 'mockumentary', 2019, 22, '{Comedy}', '{happy,comfort-watch}', 'comedy', 'Rohan Sippy', '{Mukul Chadda,Gopal Datt}', 'A mockumentary about the daily routines, office politics and trivial events at a paper company branch.', 'Work is fun when you have a boss like this.', '9m3n8pL9T12', false, null, null),

-- Short Videos
('sv-001', 'RetroScope: Behind The Screen', 'short_video', 2026, 5, '{Behind-the-Scenes}', '{happy,comfort-watch}', 'classic', 'Projectionist', '{RetroScope Staff}', 'A vintage behind-the-scenes look at how RetroScope project was engineered and designed.', 'The vintage magic is alive.', 'sE6d4x8y9z0', false, null, null);
