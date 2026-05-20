import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useContents } from '@/hooks/queries';
import { PosterCard } from '@/components/movie/PosterCard';
import { SEOHelper } from '@/components/layout/SEOHelper';
import { Layers } from 'lucide-react';

export const Route = createFileRoute('/anime/genres')({
  component: AnimeGenresPage,
});

const GENRES = ["Shonen", "Seinen", "Cyberpunk", "Slice of Life", "Fantasy", "Psychological", "Action", "Drama", "Romance"];

function AnimeGenresPage() {
  const [selectedGenre, setSelectedGenre] = useState("Shonen");
  const { data: contents = [], isLoading } = useContents({ type: 'anime' });

  // Filter content by selected genre
  const filteredAnime = contents.filter(c => c.genres.includes(selectedGenre));

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10">
      <SEOHelper 
        title={`${selectedGenre} Anime — RetroScope Genres`}
        description={`Explore outstanding ${selectedGenre} anime. Stream dual-audio action blockbusters and high school romance diaries.`}
        canonicalPath="/anime/genres"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Title Deck */}
        <div className="border-b border-primary/10 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-black text-white text-glow-pink">Genre Nodes</h1>
            <p className="text-sm text-zinc-400 mt-1">Navigate through customized anime universes and thematic nodes.</p>
          </div>
          <Layers className="h-8 w-8 text-[#22D3EE] animate-pulse" />
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-2 font-retro text-xs uppercase tracking-widest rounded-sm border transition ${
                selectedGenre === g
                  ? 'bg-[#FF4D8D] border-[#FF4D8D] text-white shadow-[0_0_15px_rgba(255,77,141,0.4)]'
                  : 'bg-[#111827] border-zinc-800 text-zinc-400 hover:border-[#FF4D8D]/40 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : filteredAnime.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
            <p className="font-retro uppercase tracking-widest text-[#FF4D8D]">Node Empty</p>
            <p className="text-sm mt-2">No anime tagged under {selectedGenre} in the projection catalog yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredAnime.map(m => (
              <PosterCard key={m.id} movie={m} size="md" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
