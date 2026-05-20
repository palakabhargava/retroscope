import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useAdminReviews, useAdminModerateReview, useAdminDeleteReview } from '@/hooks/queries';
import { ShieldAlert, CheckCircle, XCircle, Trash2, Calendar, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/_authenticated/admin/reviews')({ component: AdminReviews });

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

function AdminReviews() {
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  
  // Load reviews. If tab is 'all', we pass undefined to load all reviews
  const { data: reviews = [], isLoading } = useAdminReviews(activeTab === 'all' ? undefined : activeTab);
  
  const moderateMut = useAdminModerateReview();
  const deleteMut = useAdminDeleteReview();

  const handleApprove = async (id: string) => {
    await moderateMut.mutateAsync({ reviewId: id, status: 'approved' });
  };

  const handleReject = async (id: string) => {
    await moderateMut.mutateAsync({ reviewId: id, status: 'rejected' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review permanently from the database?')) {
      await deleteMut.mutateAsync(id);
    }
  };

  const tabs: { id: StatusFilter; label: string; countColor: string }[] = [
    { id: 'all', label: 'All Reviews', countColor: 'bg-muted text-muted-foreground' },
    { id: 'pending', label: 'Pending Moderation', countColor: 'bg-yellow-500/20 text-yellow-500' },
    { id: 'approved', label: 'Approved Notice Board', countColor: 'bg-emerald-500/20 text-emerald-500' },
    { id: 'rejected', label: 'Flagged & Rejected', countColor: 'bg-red-500/20 text-red-400' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-foreground pb-20">
      <div className="border-b border-border/40 pb-5 mb-6">
        <p className="font-retro text-xs uppercase tracking-[0.3em] text-primary">— Control Panel —</p>
        <h1 className="font-display text-4xl font-black">Review Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">Approve notices for the cinema board or reject/delete spam submissions.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-sm px-4 py-2 font-retro text-[10px] uppercase tracking-widest transition flex items-center gap-2
              ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-glow font-bold'
                : 'border border-border/80 text-muted-foreground hover:border-primary/60 hover:text-foreground bg-card'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid h-[50vh] place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="font-retro text-xs uppercase tracking-widest text-muted-foreground">Reading notice stubs...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-16 text-center text-muted-foreground bg-card/45">
          <p className="font-retro uppercase tracking-widest text-primary">No Reviews Found</p>
          <p className="text-sm mt-2">All caught up! No reviews match the selected filter category.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((r: any, idx: number) => {
            const dateStr = new Date(r.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(5, idx) * 0.05 }}
                className="relative bg-card border border-border/80 rounded-md p-6 shadow-md hover:border-primary/40 transition flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Review Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-retro text-[9px] uppercase tracking-widest text-primary bg-primary/10 border border-primary/25 px-2.5 py-0.5 rounded">
                      🎬 {r.content?.title || 'Unknown Title'}
                    </span>
                    <span className="font-retro text-[9px] uppercase tracking-widest text-muted-foreground bg-background border border-border/40 px-2 py-0.5 rounded">
                      {r.content?.type?.replace('_', ' ') || 'Reel'}
                    </span>
                    
                    {r.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 rounded bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 font-retro text-[9px] text-yellow-500 uppercase">
                        Pending
                      </span>
                    )}
                    {r.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-retro text-[9px] text-emerald-500 uppercase">
                        Approved
                      </span>
                    )}
                    {r.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 font-retro text-[9px] text-red-400 uppercase">
                        Rejected
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm leading-relaxed text-foreground italic bg-background/50 border border-border/30 p-4 rounded-sm">
                    "{r.body}"
                  </p>

                  {/* Reviewer Details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-retro">
                    <div className="flex items-center gap-1">
                      <User size={12} className="text-primary"/>
                      <span>@{r.profiles?.username || 'anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12}/>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex md:flex-col justify-end items-end gap-3 self-center md:self-stretch shrink-0">
                  <div className="flex gap-2">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-600 bg-emerald-500/10 text-emerald-500 px-3.5 py-1.5 font-retro text-[10px] uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition"
                      >
                        <CheckCircle size={12}/> Approve
                      </button>
                    )}
                    
                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject(r.id)}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-red-900 bg-red-950/20 text-red-400 px-3.5 py-1.5 font-retro text-[10px] uppercase tracking-wider hover:bg-red-500 hover:text-white transition"
                      >
                        <XCircle size={12}/> Flag / Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 rounded-sm border border-border bg-background hover:text-vintage-red hover:border-vintage-red transition"
                      title="Delete review permanently"
                    >
                      <Trash2 size={13}/>
                    </button>
                  </div>
                  <span className="text-[10px] font-retro uppercase text-muted-foreground tracking-widest hidden md:block">
                    Review ID: {r.id.slice(0, 8)}...
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
