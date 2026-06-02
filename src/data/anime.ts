import type { Atmosphere, Mood, Movie } from './movies';

type AnimeGenre =
  | 'Shonen'
  | 'Seinen'
  | 'Cyberpunk'
  | 'Slice of Life'
  | 'Fantasy'
  | 'Psychological'
  | 'Action'
  | 'Drama'
  | 'Romance'
  | 'Sci-Fi'
  | 'Thriller'
  | 'Comedy'
  | 'Mystery';

interface RawAnimeTitle {
  id: string;
  title: string;
  year: number;
  genres: AnimeGenre[];
  moods: Mood[];
  atmosphere: Atmosphere;
  studio: string;
  seasons: number;
  episodes: number;
  director: string;
  tagline: string;
  synopsis: string;
  trailerId?: string;
  poster?: string;
  banner?: string;
  rating?: number;
  recommendations?: string[];
}

const ytPoster = (id: string) => ''; // REMOVED: YouTube thumbnails are unreliable
const ytBanner = (id: string) => ''; // REMOVED: YouTube thumbnails are unreliable

// Dedicated, anime-only catalog. This intentionally lives outside `demoContent.ts`
// so anime routes can stay production-clean and never depend on movie datasets.
const ANIME_TITLES: RawAnimeTitle[] = [
  {
    id: 'an-001',
    title: 'Cyberpunk: Edgerunners',
    year: 2022,
    genres: ['Cyberpunk', 'Action', 'Sci-Fi', 'Drama'],
    moods: ['night-vibes', 'mind-blowing', 'emotional'],
    atmosphere: 'sci-fi',
    studio: 'Trigger',
    seasons: 1,
    episodes: 10,
    director: 'Hiroyuki Imaishi',
    tagline: 'A city of chrome. A heart that still bleeds.',
    synopsis:
      'In neon-soaked Night City, a street kid becomes an edgerunner — a mercenary outlaw — chasing survival, revenge, and meaning in a world that sells souls by the second.',
    trailerId: 'JtqIas3bYhg',
    recommendations: ['an-002', 'an-004', 'an-008'],
  },
  {
    id: 'an-002',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    year: 2019,
    genres: ['Shonen', 'Action', 'Drama', 'Fantasy'],
    moods: ['emotional', 'thriller-rush', 'mind-blowing'],
    atmosphere: 'drama',
    studio: 'ufotable',
    seasons: 4,
    episodes: 55,
    director: 'Haruo Sotozaki',
    tagline: 'A brother’s vow. A blade under moonlight.',
    synopsis:
      'After demons slaughter his family, Tanjiro swears to protect his sister — and to carve a path through the night toward a cure, one breathtaking battle at a time.',
    trailerId: 'VQGCKyvzIM4',
    recommendations: ['an-003', 'an-006', 'an-010'],
  },
  {
    id: 'an-003',
    title: 'Jujutsu Kaisen',
    year: 2020,
    genres: ['Shonen', 'Action', 'Thriller', 'Fantasy'],
    moods: ['thriller-rush', 'mind-blowing', 'night-vibes'],
    atmosphere: 'thriller',
    studio: 'MAPPA',
    seasons: 2,
    episodes: 47,
    director: 'Sunghoo Park',
    tagline: 'Curses don’t die — they evolve.',
    synopsis:
      'A teenager is pulled into the hidden world of cursed spirits and sorcerers. To protect others, he gambles his own humanity against ancient horrors.',
    trailerId: 'f7e3hJx8r1Q',
    recommendations: ['an-002', 'an-009', 'an-010'],
  },
  {
    id: 'an-004',
    title: 'Ghost in the Shell',
    year: 1995,
    genres: ['Cyberpunk', 'Sci-Fi', 'Psychological', 'Mystery'],
    moods: ['mind-blowing', 'lonely', 'night-vibes'],
    atmosphere: 'sci-fi',
    studio: 'Production I.G',
    seasons: 1,
    episodes: 1,
    director: 'Mamoru Oshii',
    tagline: 'What makes you… you?',
    synopsis:
      'In a networked future, Major Kusanagi hunts a hacker who can rewrite identity. Every clue pushes her deeper into a question no weapon can answer.',
    trailerId: 'G4VmJcZR0Yg',
    recommendations: ['an-001', 'an-005', 'an-008'],
  },
  {
    id: 'an-005',
    title: 'Psycho-Pass',
    year: 2012,
    genres: ['Cyberpunk', 'Thriller', 'Psychological', 'Sci-Fi'],
    moods: ['thriller-rush', 'night-vibes', 'mind-blowing'],
    atmosphere: 'thriller',
    studio: 'Production I.G',
    seasons: 3,
    episodes: 41,
    director: 'Naoyoshi Shiotani',
    tagline: 'Justice measured. Humanity judged.',
    synopsis:
      'In a society that predicts criminality, inspectors enforce “perfect” order — until the system’s blind spots reveal the cost of certainty.',
    trailerId: 'YzuJnyebc40',
    recommendations: ['an-004', 'an-007', 'an-012'],
  },
  {
    id: 'an-006',
    title: 'Attack on Titan',
    year: 2013,
    genres: ['Seinen', 'Action', 'Drama', 'Mystery'],
    moods: ['thriller-rush', 'emotional', 'mind-blowing'],
    atmosphere: 'drama',
    studio: 'WIT Studio / MAPPA',
    seasons: 4,
    episodes: 87,
    director: 'Tetsurō Araki',
    tagline: 'Freedom has a price — paid in blood.',
    synopsis:
      'Humanity shelters behind walls from towering titans. When the walls fall, a brutal war begins — one that reshapes history, identity, and truth itself.',
    trailerId: 'MGRm4IzK1SQ',
    recommendations: ['an-002', 'an-007', 'an-011'],
  },
  {
    id: 'an-007',
    title: 'Death Note',
    year: 2006,
    genres: ['Psychological', 'Thriller', 'Mystery', 'Seinen'],
    moods: ['mind-blowing', 'thriller-rush', 'night-vibes'],
    atmosphere: 'thriller',
    studio: 'Madhouse',
    seasons: 1,
    episodes: 37,
    director: 'Tetsurō Araki',
    tagline: 'Write a name. Rewrite the world.',
    synopsis:
      'A gifted student finds a notebook that kills whoever is named within it. A moral duel ignites as a legendary detective closes in — and the line between justice and godhood dissolves.',
    trailerId: 'NlJZ-YgAt-c',
    recommendations: ['an-005', 'an-009', 'an-012'],
  },
  {
    id: 'an-008',
    title: 'Neon Genesis Evangelion',
    year: 1995,
    genres: ['Psychological', 'Drama', 'Sci-Fi', 'Mystery'],
    moods: ['lonely', 'emotional', 'mind-blowing'],
    atmosphere: 'drama',
    studio: 'Gainax',
    seasons: 1,
    episodes: 26,
    director: 'Hideaki Anno',
    tagline: 'The apocalypse is internal.',
    synopsis:
      'Teen pilots defend humanity with biomechanical giants — but the real battles are fought inside the cockpit: grief, fear, and the need to be seen.',
    trailerId: '13nSISwxrY4',
    recommendations: ['an-004', 'an-005', 'an-012'],
  },
  {
    id: 'an-009',
    title: 'Steins;Gate',
    year: 2011,
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    moods: ['mind-blowing', 'emotional', 'lonely'],
    atmosphere: 'sci-fi',
    studio: 'White Fox',
    seasons: 1,
    episodes: 24,
    director: 'Hiroshi Hamasaki',
    tagline: 'One message. Infinite consequences.',
    synopsis:
      'A group of friends discovers a way to send messages to the past. Each attempt to fix fate fractures reality — and demands a sacrifice no timeline can forgive.',
    trailerId: 'dd7BILZcYAY',
    recommendations: ['an-007', 'an-010', 'an-012'],
  },
  {
    id: 'an-010',
    title: 'My Hero Academia',
    year: 2016,
    genres: ['Shonen', 'Action', 'Comedy', 'Drama'],
    moods: ['happy', 'thriller-rush', 'comfort-watch'],
    atmosphere: 'comedy',
    studio: 'Bones',
    seasons: 6,
    episodes: 138,
    director: 'Kenji Nagasaki',
    tagline: 'A powerless kid. A world that needs heroes.',
    synopsis:
      'In a world where superpowers are the norm, a quirkless teen inherits a legendary ability and learns what it means to be a hero — on screen and in the heart.',
    trailerId: 'EPVkcwyLQQ8',
    recommendations: ['an-002', 'an-003', 'an-006'],
  },
  {
    id: 'an-011',
    title: 'Vinland Saga',
    year: 2019,
    genres: ['Seinen', 'Action', 'Drama'],
    moods: ['emotional', 'thriller-rush', 'lonely'],
    atmosphere: 'drama',
    studio: 'WIT Studio / MAPPA',
    seasons: 2,
    episodes: 48,
    director: 'Shūhei Yabuta',
    tagline: 'Revenge is a chain. Peace is a war.',
    synopsis:
      'A young warrior chases vengeance across brutal Viking battlefields — only to discover that the hardest conquest is escaping hatred itself.',
    trailerId: 'xEVcTStgA4A',
    recommendations: ['an-006', 'an-007', 'an-009'],
  },
  {
    id: 'an-012',
    title: 'Violet Evergarden',
    year: 2018,
    genres: ['Drama', 'Romance', 'Slice of Life'],
    moods: ['emotional', 'comfort-watch', 'lonely'],
    atmosphere: 'romance',
    studio: 'Kyoto Animation',
    seasons: 1,
    episodes: 13,
    director: 'Taichi Ishidate',
    tagline: 'A letter can carry a soul.',
    synopsis:
      'A former child soldier becomes an “Auto Memory Doll,” writing letters for others to understand emotions she never had words for — until love teaches her language.',
    trailerId: 'UZEOpfelkxQ',
    recommendations: ['an-008', 'an-009', 'an-011'],
  },
];

export const ANIME_CATALOG: Movie[] = ANIME_TITLES.map((a, idx) => {
  // Use provided anime artwork or fallback to category defaults (not YouTube thumbnails)
  return {
    id: a.id,
    title: a.title,
    type: 'anime',
    year: a.year,
    runtime: 24,
    genres: a.genres,
    moods: a.moods,
    atmosphere: a.atmosphere,
    director: a.director,
    cast: ['Voice Actor A', 'Voice Actor B', 'Voice Actor C'],
    synopsis: a.synopsis,
    poster: a.poster || '',  // Empty string = use CinematicImage fallback chain with anime-specific fallbacks
    banner: a.banner || '',  // Empty string = use CinematicImage fallback chain with anime-specific fallbacks
    trailerId: a.trailerId,
    tagline: a.tagline,
    isPremium: idx % 3 === 0,
    studio: a.studio,
    seasons: a.seasons,
    episodes: a.episodes,
    isDualAudio: true,
    subtitles: ['English', 'Japanese', 'Hindi'],
    audioLangs: ['Japanese', 'English'],
    ageRating: idx % 7 === 0 ? '17+' : 'PG-13',
    sceneTimestamps: [
      { time: 10, label: 'Opening Theme (OP)' },
      { time: 180, label: 'Midpoint Impact' },
      { time: 300, label: 'Ending Theme (ED)' },
    ],
    rating: a.rating ?? +(7.6 + ((idx * 7) % 18) / 10).toFixed(1),
  };
});

export const findAnime = (id: string) => ANIME_CATALOG.find((a) => a.id === id);

export const animeRecommendations = (id: string, limit = 6): Movie[] => {
  const seed = ANIME_TITLES.find((a) => a.id === id);
  const recIds = seed?.recommendations ?? [];
  const byId = recIds.map((rid) => findAnime(rid)).filter(Boolean) as Movie[];
  if (byId.length >= limit) return byId.slice(0, limit);

  // Fill remaining slots with same-atmosphere titles (keeps cinematic vibe coherent).
  const anchor = findAnime(id);
  const filler = (anchor ? ANIME_CATALOG.filter((x) => x.id !== id && x.atmosphere === anchor.atmosphere) : ANIME_CATALOG)
    .slice(0, Math.max(0, limit - byId.length));
  return [...byId, ...filler].slice(0, limit);
};

