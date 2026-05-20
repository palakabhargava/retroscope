import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CONTENT_TYPES, type ContentType, type Atmosphere, type Mood } from '@/data/movies';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useContents, useAdminCreateContent, useAdminUpdateContent, useAdminDeleteContent } from '@/hooks/queries';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/_authenticated/admin/movies')({ component: AdminMovies });

const ATMOSPHERES: Atmosphere[] = ['horror', 'romance', 'sci-fi', 'drama', 'thriller', 'comedy', 'classic'];
const MOOD_LIST: Mood[] = ['lonely', 'happy', 'emotional', 'night-vibes', 'mind-blowing', 'thriller-rush', 'rainy-mood', 'comfort-watch'];

function AdminMovies() {
  const { data: contents = [], isLoading } = useContents();
  const createMut = useAdminCreateContent();
  const updateMut = useAdminUpdateContent();
  const deleteMut = useAdminDeleteContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form Fields State
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<ContentType>('movie');
  const [formYear, setFormYear] = useState<number>(new Date().getFullYear());
  const [formRuntime, setFormRuntime] = useState<number>(120);
  const [formGenres, setFormGenres] = useState('');
  const [formMoods, setFormMoods] = useState<Mood[]>([]);
  const [formAtmosphere, setFormAtmosphere] = useState<Atmosphere>('drama');
  const [formDirector, setFormDirector] = useState('');
  const [formCast, setFormCast] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formPoster, setFormPoster] = useState('');
  const [formBanner, setFormBanner] = useState('');
  const [formTrailerId, setFormTrailerId] = useState('');
  const [formIsPremium, setFormIsPremium] = useState(false);

  const resetForm = () => {
    setEditingItem(null);
    setFormId('');
    setFormTitle('');
    setFormType('movie');
    setFormYear(new Date().getFullYear());
    setFormRuntime(120);
    setFormGenres('');
    setFormMoods([]);
    setFormAtmosphere('drama');
    setFormDirector('');
    setFormCast('');
    setFormSynopsis('');
    setFormTagline('');
    setFormPoster('');
    setFormBanner('');
    setFormTrailerId('');
    setFormIsPremium(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    // Pre-generate a simple unique ID
    setFormId(`content-${Date.now().toString().slice(-6)}`);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormTitle(item.title);
    setFormType(item.type);
    setFormYear(item.year);
    setFormRuntime(item.runtime);
    setFormGenres(item.genres ? item.genres.join(', ') : '');
    setFormMoods(item.moods || []);
    setFormAtmosphere(item.atmosphere || 'drama');
    setFormDirector(item.director || '');
    setFormCast(item.cast ? item.cast.join(', ') : '');
    setFormSynopsis(item.synopsis || '');
    setFormTagline(item.tagline || '');
    // Extract url format if needed
    setFormPoster(item.poster ? item.poster.replace(/^url\('?|'?\)$/g, '') : '');
    setFormBanner(item.banner ? item.banner.replace(/^url\('?|'?\)$/g, '') : '');
    setFormTrailerId(item.trailerId || '');
    setFormIsPremium(item.isPremium || false);
    setIsModalOpen(true);
  };

  const toggleMood = (mood: Mood) => {
    setFormMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formTitle || !formDirector || !formSynopsis) return;

    const payload = {
      id: formId,
      title: formTitle,
      type: formType,
      year: Number(formYear),
      runtime: Number(formRuntime),
      genres: formGenres.split(',').map(g => g.trim()).filter(Boolean),
      moods: formMoods,
      atmosphere: formAtmosphere,
      director: formDirector,
      cast: formCast.split(',').map(c => c.trim()).filter(Boolean),
      synopsis: formSynopsis,
      tagline: formTagline,
      poster: formPoster ? (formPoster.startsWith('linear') ? formPoster : `url('${formPoster}')`) : null,
      banner: formBanner ? `url('${formBanner}')` : null,
      trailer_id: formTrailerId || null,
      is_premium: formIsPremium
    };

    try {
      if (editingItem) {
        await updateMut.mutateAsync(payload);
      } else {
        await createMut.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      // toast is automatically displayed in react query hooks
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you absolutely sure you want to burn this reel from the catalogue?')) {
      await deleteMut.mutateAsync(id);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-foreground pb-20">
      <div className="flex items-center justify-between border-b border-border/40 pb-5">
        <div>
          <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Curated Vault —</p>
          <h1 className="font-display text-4xl font-black">Media Catalogue</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage movies, web series, and short features in the Supabase database.</p>
        </div>
        <button onClick={handleOpenAdd} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition">
          <Plus size={14}/> Add New Reel
        </button>
      </div>

      {isLoading ? (
        <div className="grid h-[50vh] place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">Opening vault cabinets...</p>
          </div>
        </div>
      ) : contents.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-border p-16 text-center text-muted-foreground">
          <p className="font-retro uppercase tracking-widest text-primary">No catalogue records found</p>
          <p className="text-sm mt-2">Click "Add New Reel" to start inserting database content.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-border bg-card shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50 text-left font-retro text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-4">Title & Type</th>
                <th className="px-5 py-4">Year</th>
                <th className="px-5 py-4">Atmosphere</th>
                <th className="px-5 py-4">Runtime</th>
                <th className="px-5 py-4">Premium</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contents.map(m => (
                <tr key={m.id} className="border-b border-border/40 hover:bg-background/40 transition">
                  <td className="px-5 py-4">
                    <div>
                      <div className="font-bold text-foreground">{m.title}</div>
                      <div className="text-[10px] font-retro uppercase tracking-wider text-primary mt-0.5">
                        {m.type.replace('_', ' ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground font-retro">{m.year}</td>
                  <td className="px-5 py-4 text-muted-foreground capitalize">{m.atmosphere}</td>
                  <td className="px-5 py-4 text-muted-foreground font-retro">{m.runtime}m</td>
                  <td className="px-5 py-4">
                    {m.isPremium ? (
                      <span className="rounded bg-primary/25 border border-primary/40 px-2 py-0.5 font-retro text-[9px] text-primary uppercase">Gold ticket</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-primary font-retro font-bold">★ {m.rating}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleOpenEdit(m)} className="p-1.5 rounded-sm border border-border bg-background/60 text-muted-foreground hover:text-primary hover:border-primary transition">
                        <Pencil size={13}/>
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-sm border border-border bg-background/60 text-muted-foreground hover:text-vintage-red hover:border-vintage-red transition">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Glassmorphic Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-3xl bg-card border border-border/80 rounded-md p-6 shadow-2xl my-8"
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>

            <h2 className="font-display text-2xl font-black mb-1 text-glow">
              {editingItem ? 'Edit Catalogue Reel' : 'Add New Cinematic Reel'}
            </h2>
            <p className="text-xs text-muted-foreground mb-6">Write data variables directly to the unified SQL database table.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Unique Reel ID</label>
                  <input required value={formId} onChange={e => setFormId(e.target.value)} disabled={!!editingItem} placeholder="e.g. mv-022, ws-005"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-50"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Title</label>
                  <input required value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Masterpiece Cinema"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Type</label>
                  <select value={formType} onChange={e => setFormType(e.target.value as ContentType)}
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    {CONTENT_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Year</label>
                  <input required type="number" value={formYear} onChange={e => setFormYear(Number(e.target.value))}
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Runtime (mins)</label>
                  <input required type="number" value={formRuntime} onChange={e => setFormRuntime(Number(e.target.value))}
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Atmosphere</label>
                  <select value={formAtmosphere} onChange={e => setFormAtmosphere(e.target.value as Atmosphere)}
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    {ATMOSPHERES.map(a => (
                      <option key={a} value={a}>{a.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Director</label>
                  <input required value={formDirector} onChange={e => setFormDirector(e.target.value)} placeholder="e.g. S. S. Rajamouli"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Cast (comma-separated)</label>
                  <input value={formCast} onChange={e => setFormCast(e.target.value)} placeholder="e.g. Prabhas, Yash, Saif Ali"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Genres (comma-separated)</label>
                <input value={formGenres} onChange={e => setFormGenres(e.target.value)} placeholder="e.g. Action, Crime, Biography"
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-2">Mood Vibe Tags</label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_LIST.map(m => {
                    const active = formMoods.includes(m);
                    return (
                      <button type="button" key={m} onClick={() => toggleMood(m)}
                        className={`rounded-full px-3 py-1 text-xs transition border font-retro tracking-wider uppercase
                          ${active 
                            ? 'bg-primary/20 border-primary text-primary shadow-glow font-bold' 
                            : 'border-border bg-background hover:border-primary/50 text-muted-foreground'}`}>
                        {m.replace('-', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Poster Image URL (or gradient code)</label>
                  <input value={formPoster} onChange={e => setFormPoster(e.target.value)} placeholder="e.g. /images/my-poster.jpg"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">YouTube Trailer ID</label>
                  <input value={formTrailerId} onChange={e => setFormTrailerId(e.target.value)} placeholder="e.g. JKa05nyUmuQ"
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Banner Image URL</label>
                <input value={formBanner} onChange={e => setFormBanner(e.target.value)} placeholder="e.g. /images/my-banner.jpg"
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Tagline</label>
                <input required value={formTagline} onChange={e => setFormTagline(e.target.value)} placeholder="e.g. Greed has a shape."
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-retro tracking-widest text-muted-foreground mb-1.5">Synopsis / Vault Blurb</label>
                <textarea required rows={3} value={formSynopsis} onChange={e => setFormSynopsis(e.target.value)} placeholder="A brief description of this masterpiece chronicle..."
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"/>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPremium" checked={formIsPremium} onChange={e => setFormIsPremium(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-background"/>
                <label htmlFor="isPremium" className="text-xs uppercase font-retro tracking-widest text-primary cursor-pointer font-bold select-none">
                  Require VIP Gold Ticket for screen access
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="rounded-sm border border-border px-4 py-2 font-retro text-xs uppercase tracking-widest hover:bg-background/80 transition">
                  Cancel
                </button>
                <button type="submit" disabled={createMut.isPending || updateMut.isPending}
                  className="rounded-sm bg-primary px-6 py-2 font-retro text-xs uppercase tracking-widest text-primary-foreground hover:bg-hover-glow projector-glow transition disabled:opacity-50">
                  {editingItem ? 'Save Updates' : 'Inject to DB'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
