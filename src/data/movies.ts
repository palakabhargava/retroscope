export type Mood = 'lonely' | 'happy' | 'emotional' | 'night-vibes' | 'mind-blowing' | 'thriller-rush' | 'rainy-mood' | 'comfort-watch';
export type Atmosphere = 'horror' | 'romance' | 'sci-fi' | 'drama' | 'thriller' | 'comedy' | 'classic';

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number; // minutes
  genres: string[];
  moods: Mood[];
  atmosphere: Atmosphere;
  rating: number;
  director: string;
  cast: string[];
  synopsis: string;
  poster: string;       // CSS background-image value
  banner: string;       // CSS background-image value
  trailerId?: string;   // YouTube video id
  tagline: string;
  reactions?: { time: number; emoji: string; label: string }[];
}

const POSTER_PALETTES: Record<Atmosphere, [string, string, string]> = {
  horror:   ['#3a0a0a', '#7a1d1d', '#1a0505'],
  romance:  ['#5a2a1a', '#c98060', '#2a1208'],
  'sci-fi': ['#0a1a3a', '#2d6e9e', '#050a1a'],
  drama:    ['#2a1a0a', '#a07040', '#10080a'],
  thriller: ['#1a0f0a', '#5a2a30', '#0a0506'],
  comedy:   ['#3a2a0a', '#e8b04a', '#1a0f08'],
  classic:  ['#2a1f10', '#a08660', '#0f0a05'],
};

function mkPoster(atm: Atmosphere, seed: number): string {
  const [a, b, c] = POSTER_PALETTES[atm];
  return `linear-gradient(${(seed * 47) % 360}deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}

interface RawTitle {
  title: string; year: number; runtime: number;
  genres: string[]; moods: Mood[]; atmosphere: Atmosphere;
  director: string; cast: string[]; tagline: string; trailerId: string;
  rating?: number;
}

const TITLES: RawTitle[] = [
  { title: 'Baahubali: The Beginning', year: 2015, runtime: 159, genres: ['Action','Epic','Drama'], moods: ['mind-blowing','thriller-rush'], atmosphere: 'drama', director: 'S. S. Rajamouli', cast: ['Prabhas','Rana Daggubati','Anushka Shetty','Tamannaah'], tagline: 'Why did Kattappa kill Baahubali?', trailerId: 'sOEg_YZQsTI', rating: 8.0 },
  { title: 'Baahubali 2: The Conclusion', year: 2017, runtime: 167, genres: ['Action','Epic','Drama'], moods: ['mind-blowing','emotional'], atmosphere: 'drama', director: 'S. S. Rajamouli', cast: ['Prabhas','Rana Daggubati','Anushka Shetty','Ramya Krishnan'], tagline: 'The conclusion of an empire.', trailerId: 'G62HrubdD6o', rating: 8.2 },
  { title: 'Salaar: Part 1 – Ceasefire', year: 2023, runtime: 175, genres: ['Action','Thriller'], moods: ['thriller-rush','night-vibes'], atmosphere: 'thriller', director: 'Prashanth Neel', cast: ['Prabhas','Prithviraj Sukumaran','Shruti Haasan'], tagline: 'A violent gang lord. A ceasefire that shouldn\u2019t break.', trailerId: 'BkVk5sPxgEI', rating: 7.4 },
  { title: 'RRR', year: 2022, runtime: 187, genres: ['Action','Drama','Musical'], moods: ['mind-blowing','happy','thriller-rush'], atmosphere: 'drama', director: 'S. S. Rajamouli', cast: ['N. T. Rama Rao Jr.','Ram Charan','Alia Bhatt','Ajay Devgn'], tagline: 'Rise. Roar. Revolt.', trailerId: 'f_vbAtFSEc0', rating: 7.9 },
  { title: 'KGF: Chapter 1', year: 2018, runtime: 156, genres: ['Action','Crime'], moods: ['thriller-rush','night-vibes'], atmosphere: 'thriller', director: 'Prashanth Neel', cast: ['Yash','Srinidhi Shetty','Ramachandra Raju'], tagline: 'A boy. An empire of gold.', trailerId: '_3kxbRR1HuE', rating: 8.2 },
  { title: 'KGF: Chapter 2', year: 2022, runtime: 168, genres: ['Action','Crime'], moods: ['thriller-rush','mind-blowing'], atmosphere: 'thriller', director: 'Prashanth Neel', cast: ['Yash','Sanjay Dutt','Raveena Tandon','Srinidhi Shetty'], tagline: 'The rise of a monster.', trailerId: 'JKa05nyUmuQ', rating: 8.2 },
  { title: 'Pushpa: The Rise', year: 2021, runtime: 179, genres: ['Action','Crime','Drama'], moods: ['thriller-rush','night-vibes'], atmosphere: 'thriller', director: 'Sukumar', cast: ['Allu Arjun','Rashmika Mandanna','Fahadh Faasil'], tagline: 'A flower with a thorn.', trailerId: 'pKctjlxbFDA', rating: 7.6 },
  { title: 'Kantara', year: 2022, runtime: 150, genres: ['Action','Drama','Thriller'], moods: ['mind-blowing','emotional'], atmosphere: 'drama', director: 'Rishab Shetty', cast: ['Rishab Shetty','Sapthami Gowda','Kishore'], tagline: 'A legend. A land. A reckoning.', trailerId: '9KR4ie-aN1Y', rating: 8.5 },
  { title: 'Jawan', year: 2023, runtime: 169, genres: ['Action','Thriller'], moods: ['thriller-rush'], atmosphere: 'thriller', director: 'Atlee', cast: ['Shah Rukh Khan','Nayanthara','Vijay Sethupathi'], tagline: 'Before you judge him, beware of him.', trailerId: 'M9D-fcJrGY0', rating: 7.0 },
  { title: 'Pathaan', year: 2023, runtime: 146, genres: ['Action','Spy','Thriller'], moods: ['thriller-rush','night-vibes'], atmosphere: 'thriller', director: 'Siddharth Anand', cast: ['Shah Rukh Khan','Deepika Padukone','John Abraham'], tagline: 'Pathaan zinda hai.', trailerId: 'vqu4z34wENw', rating: 6.0 },
  { title: '3 Idiots', year: 2009, runtime: 170, genres: ['Comedy','Drama'], moods: ['happy','comfort-watch','emotional'], atmosphere: 'comedy', director: 'Rajkumar Hirani', cast: ['Aamir Khan','R. Madhavan','Sharman Joshi','Kareena Kapoor'], tagline: 'Aal izz well.', trailerId: 'xvszmNXdM4w', rating: 8.4 },
  { title: 'Dangal', year: 2016, runtime: 161, genres: ['Biography','Drama','Sport'], moods: ['emotional','happy'], atmosphere: 'drama', director: 'Nitesh Tiwari', cast: ['Aamir Khan','Fatima Sana Shaikh','Sanya Malhotra'], tagline: 'Mhaari chhoriyaan chhoron se kam hain ke?', trailerId: 'x_7YlGv9u1g', rating: 8.4 },
  { title: 'PK', year: 2014, runtime: 153, genres: ['Comedy','Drama','Sci-Fi'], moods: ['mind-blowing','comfort-watch'], atmosphere: 'sci-fi', director: 'Rajkumar Hirani', cast: ['Aamir Khan','Anushka Sharma','Sanjay Dutt'], tagline: 'An alien on a mission.', trailerId: 'SOXWc32k6E8', rating: 8.1 },
  { title: 'Drishyam 2', year: 2022, runtime: 140, genres: ['Crime','Drama','Mystery'], moods: ['thriller-rush','rainy-mood'], atmosphere: 'thriller', director: 'Abhishek Pathak', cast: ['Ajay Devgn','Tabu','Akshaye Khanna'], tagline: 'A visual can deceive. A story can heal.', trailerId: 'BjgU3UoZbT0', rating: 8.2 },
  { title: 'Andhadhun', year: 2018, runtime: 139, genres: ['Crime','Mystery','Thriller'], moods: ['thriller-rush','mind-blowing'], atmosphere: 'thriller', director: 'Sriram Raghavan', cast: ['Ayushmann Khurrana','Tabu','Radhika Apte'], tagline: 'What is life? It depends on the liver.', trailerId: '2-hQAEOlt8s', rating: 8.2 },
  { title: 'Tumbbad', year: 2018, runtime: 104, genres: ['Fantasy','Horror','Mystery'], moods: ['rainy-mood','night-vibes','thriller-rush'], atmosphere: 'horror', director: 'Rahi Anil Barve', cast: ['Sohum Shah','Jyoti Malshe','Anita Date'], tagline: 'Greed has a shape.', trailerId: '5fPCkN1WQEs', rating: 8.2 },
  { title: 'Lagaan', year: 2001, runtime: 224, genres: ['Drama','Musical','Sport'], moods: ['emotional','happy','comfort-watch'], atmosphere: 'classic', director: 'Ashutosh Gowariker', cast: ['Aamir Khan','Gracy Singh','Rachel Shelley'], tagline: 'Once upon a time in India.', trailerId: 'oxSTLuBAGa0', rating: 8.1 },
  { title: 'Zindagi Na Milegi Dobara', year: 2011, runtime: 155, genres: ['Comedy','Drama','Adventure'], moods: ['happy','comfort-watch'], atmosphere: 'comedy', director: 'Zoya Akhtar', cast: ['Hrithik Roshan','Farhan Akhtar','Abhay Deol','Katrina Kaif'], tagline: 'You won\u2019t live this life again.', trailerId: 'FJrpcDgC3zU', rating: 8.2 },
  { title: 'Animal', year: 2023, runtime: 201, genres: ['Action','Crime','Drama'], moods: ['thriller-rush','night-vibes'], atmosphere: 'thriller', director: 'Sandeep Reddy Vanga', cast: ['Ranbir Kapoor','Anil Kapoor','Bobby Deol','Rashmika Mandanna'], tagline: 'Born of love. Made of rage.', trailerId: 'Q8RR4DyGqqk', rating: 6.4 },
  { title: 'Vikram', year: 2022, runtime: 174, genres: ['Action','Crime','Thriller'], moods: ['thriller-rush','mind-blowing'], atmosphere: 'thriller', director: 'Lokesh Kanagaraj', cast: ['Kamal Haasan','Vijay Sethupathi','Fahadh Faasil'], tagline: 'A hunt has begun.', trailerId: 'OKBMCL-frPU', rating: 8.4 },
  { title: 'Master', year: 2021, runtime: 179, genres: ['Action','Drama','Thriller'], moods: ['thriller-rush'], atmosphere: 'thriller', director: 'Lokesh Kanagaraj', cast: ['Vijay','Vijay Sethupathi','Malavika Mohanan'], tagline: 'Vaathi coming.', trailerId: 'VxBWyVjVayM', rating: 7.3 },
  { title: 'Ponniyin Selvan: I', year: 2022, runtime: 167, genres: ['Action','Drama','Epic'], moods: ['mind-blowing','emotional'], atmosphere: 'drama', director: 'Mani Ratnam', cast: ['Vikram','Aishwarya Rai','Jayam Ravi','Karthi'], tagline: 'The empire of the Cholas begins.', trailerId: '6mp4Qzpa2EQ', rating: 7.6 },
  { title: 'Leo', year: 2023, runtime: 164, genres: ['Action','Crime','Thriller'], moods: ['thriller-rush'], atmosphere: 'thriller', director: 'Lokesh Kanagaraj', cast: ['Vijay','Sanjay Dutt','Trisha'], tagline: 'A man with no past has the most to hide.', trailerId: 'Po3jStA673E', rating: 7.0 },
  { title: 'Article 15', year: 2019, runtime: 130, genres: ['Crime','Drama','Mystery'], moods: ['emotional','rainy-mood'], atmosphere: 'drama', director: 'Anubhav Sinha', cast: ['Ayushmann Khurrana','Isha Talwar','Sayani Gupta'], tagline: 'Farq bahut kar liya, ab farq laayenge.', trailerId: 'WBPWUkSlcCc', rating: 8.1 },
];

const ytPoster  = (id: string) => `url('https://i.ytimg.com/vi/${id}/hqdefault.jpg')`;
const ytBanner  = (id: string) => `url('https://i.ytimg.com/vi/${id}/maxresdefault.jpg')`;

// Real movie posters (Wikipedia/Wikimedia, fair-use thumbnails)
const POSTER_OVERRIDES: Record<string, string> = {
  'Baahubali: The Beginning': 'https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg',
  'Baahubali 2: The Conclusion': 'https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg',
  'Salaar: Part 1 – Ceasefire': 'https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg',
  'RRR': 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg',
  'KGF: Chapter 1': 'https://upload.wikimedia.org/wikipedia/en/c/cc/K.G.F_Chapter_1_poster.jpg',
  'KGF: Chapter 2': 'https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg',
  'Pushpa: The Rise': 'https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg',
  'Kantara': 'https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg',
  'Jawan': 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
  'Pathaan': 'https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg',
  '3 Idiots': 'https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg',
  'Dangal': 'https://upload.wikimedia.org/wikipedia/en/3/3e/Dangal_Poster.jpg',
  'PK': 'https://upload.wikimedia.org/wikipedia/en/c/c3/PK_poster.jpg',
  'Drishyam 2': 'https://upload.wikimedia.org/wikipedia/en/9/9e/Drishyam_2_2022_film_poster.jpg',
  'Andhadhun': 'https://upload.wikimedia.org/wikipedia/en/4/47/Andhadhun_poster.jpg',
  'Tumbbad': 'https://upload.wikimedia.org/wikipedia/en/4/41/Tumbbad_poster.jpg',
  'Lagaan': 'https://upload.wikimedia.org/wikipedia/en/b/b6/Lagaan.jpg',
  'Zindagi Na Milegi Dobara': 'https://upload.wikimedia.org/wikipedia/en/1/17/Zindagi_Na_Milegi_Dobara.jpg',
  'Animal': 'https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg',
  'Vikram': 'https://upload.wikimedia.org/wikipedia/en/9/93/Vikram_2022_poster.jpg',
  'Master': 'https://upload.wikimedia.org/wikipedia/en/5/53/Master_2021_poster.jpg',
  'Ponniyin Selvan: I': 'https://upload.wikimedia.org/wikipedia/en/c/c3/Ponniyin_Selvan_I.jpg',
  'Leo': 'https://upload.wikimedia.org/wikipedia/en/7/75/Leo_%282023_Indian_film%29.jpg',
  'Article 15': 'https://upload.wikimedia.org/wikipedia/en/1/11/Article_15_Poster.jpg',
};

export const posterUrl = (title: string, fallback?: string): string | undefined => {
  const u = POSTER_OVERRIDES[title];
  return u ?? fallback;
};

export const MOVIES: Movie[] = TITLES.map((t, i) => ({
  id: `mv-${String(i + 1).padStart(3, '0')}`,
  title: t.title, year: t.year, runtime: t.runtime,
  genres: t.genres, moods: t.moods, atmosphere: t.atmosphere,
  director: t.director, cast: t.cast, tagline: t.tagline,
  trailerId: t.trailerId,
  rating: t.rating ?? +(7 + (i % 30) / 10).toFixed(1),
  synopsis: `${t.tagline} A ${t.year} ${t.genres.join(' / ').toLowerCase()} feature directed by ${t.director}, starring ${t.cast.slice(0, 2).join(' and ')}. Presented in the RetroScope projection room as a recruiter-grade demo \u2014 the trailer plays, the feature stays sealed.`,
  poster: POSTER_OVERRIDES[t.title]
    ? `url('${POSTER_OVERRIDES[t.title]}')`
    : (t.trailerId ? ytPoster(t.trailerId) : mkPoster(t.atmosphere, i + 1)),
  banner: t.trailerId ? ytBanner(t.trailerId) : mkPoster(t.atmosphere, i + 7),
  reactions: [
    { time: 18, emoji: '😮', label: 'Plot twist' },
    { time: 42, emoji: '😭', label: 'Emotional spike' },
    { time: 67, emoji: '🔥', label: 'Iconic scene' },
    { time: 88, emoji: '🤯', label: 'Mind blown' },
  ],
}));

export const MOODS: { id: Mood; label: string; tint: string; emoji: string }[] = [
  { id: 'lonely',         label: 'Lonely',         tint: 'oklch(0.40 0.10 260)', emoji: '🌧' },
  { id: 'happy',          label: 'Happy',          tint: 'oklch(0.70 0.16 80)',  emoji: '✨' },
  { id: 'emotional',      label: 'Emotional',      tint: 'oklch(0.55 0.16 22)',  emoji: '💔' },
  { id: 'night-vibes',    label: 'Night Vibes',    tint: 'oklch(0.35 0.10 280)', emoji: '🌙' },
  { id: 'mind-blowing',   label: 'Mind-Blowing',   tint: 'oklch(0.60 0.18 300)', emoji: '🤯' },
  { id: 'thriller-rush',  label: 'Thriller Rush',  tint: 'oklch(0.50 0.18 25)',  emoji: '🗡' },
  { id: 'rainy-mood',     label: 'Rainy Mood',     tint: 'oklch(0.45 0.08 240)', emoji: '☔' },
  { id: 'comfort-watch',  label: 'Comfort Watch',  tint: 'oklch(0.65 0.13 65)',  emoji: '🍿' },
];

export const TIME_BUCKETS = [
  { id: '20m',     label: '20 mins',      max: 30, sub: 'A short reel' },
  { id: '1h',      label: '1 hour',       max: 75, sub: 'A quick feature' },
  { id: 'night',   label: 'Movie Night',  max: 130, sub: 'Full evening' },
  { id: 'binge',   label: 'Weekend Binge',max: 999, sub: 'Long-haul cinema' },
];

export const findMovie = (id: string) => MOVIES.find(m => m.id === id);
export const moviesByMood = (m: Mood) => MOVIES.filter(x => x.moods.includes(m));
export const moviesByRuntime = (max: number) => MOVIES.filter(x => x.runtime <= max);
