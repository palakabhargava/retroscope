import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapDbToMovie, type Movie, type ContentType, type Mood } from '@/data/movies';
import { toast } from 'sonner';

// Helper to check if a user is an admin
export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId);
  return !!data?.some(r => r.role === 'admin');
}

// 1. Fetch contents with filters
export function useContents(filters?: {
  type?: ContentType;
  genre?: string;
  mood?: Mood;
  maxRuntime?: number;
  limit?: number;
  order?: 'created_at' | 'title' | 'year';
}) {
  return useQuery({
    queryKey: ['contents', filters],
    queryFn: async () => {
      let query = supabase.from('content').select('*');

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.genre) {
        query = query.contains('genres', [filters.genre]);
      }
      if (filters?.mood) {
        query = query.contains('moods', [filters.mood]);
      }
      if (filters?.maxRuntime) {
        query = query.lte('runtime', filters.maxRuntime);
      }
      if (filters?.order) {
        query = query.order(filters.order, { ascending: filters.order !== 'created_at' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      // For each content item, we fetch its average rating
      const mapped = await Promise.all(
        (data || []).map(async (row) => {
          const { data: ratingData } = await supabase
            .from('ratings')
            .select('rating');
          
          const itemRatings = (ratingData || []).filter((r: any) => r.content_id === row.id);
          const avg = itemRatings.length > 0 
            ? itemRatings.reduce((sum, r) => sum + r.rating, 0) / itemRatings.length
            : 7.5; // default fallback if no ratings yet

          return mapDbToMovie(row, avg);
        })
      );

      return mapped;
    },
  });
}

// 2. Fetch single content item detail with its reviews and reactions
export function useContentItem(id: string) {
  return useQuery({
    queryKey: ['content-item', id],
    queryFn: async () => {
      // Fetch content
      const { data: row, error: rowErr } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (rowErr) throw rowErr;
      if (!row) throw new Error('Content not found');

      // Fetch all ratings for average calculation
      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('rating')
        .eq('content_id', id);
      
      const ratings = ratingsData || [];
      const ratingCount = ratings.length;
      const averageRating = ratingCount > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 7.5;

      // Fetch approved reviews with profile details
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (username, avatar_seed)
        `)
        .eq('content_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Fetch reactions
      const { data: reactionsData } = await supabase
        .from('reactions')
        .select('*')
        .eq('content_id', id);

      const movie = mapDbToMovie(row, averageRating);
      
      // Merge reactions into movie format
      // Map timestamp to percentage or seconds
      const rawReactions = (reactionsData || []).map(r => ({
        time: Math.min(100, Math.floor((r.timestamp / (row.runtime * 60)) * 100)),
        emoji: r.emoji,
        label: r.emoji === '😮' ? 'Plot twist' : r.emoji === '😭' ? 'Emotional spike' : r.emoji === '🔥' ? 'Iconic scene' : 'Mind blown'
      }));

      // If database has no reactions yet, fallback to the hardcoded ones to look beautiful
      movie.reactions = rawReactions.length > 0 ? rawReactions : [
        { time: 18, emoji: '😮', label: 'Plot twist' },
        { time: 42, emoji: '😭', label: 'Emotional spike' },
        { time: 67, emoji: '🔥', label: 'Iconic scene' },
        { time: 88, emoji: '🤯', label: 'Mind blown' },
      ];

      return {
        movie,
        ratingCount,
        averageRating,
        reviews: reviewsData || [],
        reactions: reactionsData || [],
      };
    },
  });
}

// 3. User rating query and mutation
export function useUserRating(contentId: string, userId?: string) {
  return useQuery({
    queryKey: ['user-rating', contentId, userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data?.rating || null;
    },
  });
}

export function useSaveRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ contentId, userId, rating }: { contentId: string; userId: string; rating: number }) => {
      // Upsert rating
      const { data: existing } = await supabase
        .from('ratings')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('ratings')
          .update({ rating, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ratings')
          .insert({ content_id: contentId, user_id: userId, rating });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content-item', variables.contentId] });
      queryClient.invalidateQueries({ queryKey: ['user-rating', variables.contentId, variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      toast.success('Your ticket rating has been punched!');
    },
  });
}

// 4. User review mutations
export function useSaveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ contentId, userId, body }: { contentId: string; userId: string; body: string }) => {
      const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('reviews')
          .update({ body, status: 'approved', updated_at: new Date().toISOString() }) // default to approved for instant feed
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert({ content_id: contentId, user_id: userId, body, status: 'approved' });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content-item', variables.contentId] });
      toast.success('Your review was posted on the cinema notice board!');
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, contentId }: { reviewId: string; contentId: string }) => {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content-item', variables.contentId] });
      toast.success('Review removed.');
    },
  });
}

// 5. Add play reaction
export function useAddReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ contentId, userId, emoji, timestamp }: { contentId: string; userId: string; emoji: string; timestamp: number }) => {
      const { error } = await supabase
        .from('reactions')
        .insert({ content_id: contentId, user_id: userId, emoji, timestamp });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content-item', variables.contentId] });
    },
  });
}

// 6. Log play analytics
export function useLogPlayEvent() {
  return useMutation({
    mutationFn: async ({ contentId, userId, progress }: { contentId: string; userId?: string; progress: number }) => {
      await supabase
        .from('analytics')
        .insert({ content_id: contentId, user_id: userId || null, event_type: 'play', progress_pct: progress });
    },
  });
}

// 7. Trending and top-rated queries
export function useTrendingContent() {
  return useQuery({
    queryKey: ['trending-content'],
    queryFn: async () => {
      // Custom algorithm: Select elements with play events in analytics
      // Fallback: order by year desc
      const { data: analyticRows } = await supabase
        .from('analytics')
        .select('content_id')
        .eq('event_type', 'play')
        .limit(500);

      const counts = new Map<string, number>();
      (analyticRows || []).forEach(row => counts.set(row.content_id, (counts.get(row.content_id) || 0) + 1));
      
      const sortedIds = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]);
      
      const { data: contentRows, error } = await supabase.from('content').select('*');
      if (error) throw error;

      const mapped = await Promise.all(
        (contentRows || []).map(async (row) => {
          const { data: ratingData } = await supabase.from('ratings').select('rating').eq('content_id', row.id);
          const avg = ratingData && ratingData.length > 0
            ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
            : 7.5;
          return mapDbToMovie(row, avg);
        })
      );

      // Sort according to play counts, fallback to year descending
      return mapped.sort((a, b) => {
        const indexA = sortedIds.indexOf(a.id);
        const indexB = sortedIds.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return b.year - a.year;
      });
    },
  });
}

export function useTopRatedContent() {
  return useQuery({
    queryKey: ['top-rated-content'],
    queryFn: async () => {
      const { data: contentRows, error } = await supabase.from('content').select('*');
      if (error) throw error;

      const mapped = await Promise.all(
        (contentRows || []).map(async (row) => {
          const { data: ratingData } = await supabase.from('ratings').select('rating').eq('content_id', row.id);
          const avg = ratingData && ratingData.length > 0
            ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
            : 7.5;
          return mapDbToMovie(row, avg);
        })
      );

      // Sort by rating descending
      return mapped.sort((a, b) => b.rating - a.rating);
    },
  });
}

// === ADMIN API HOOKS ===

// 1. Admin Content CRUD Mutations
export function useAdminCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create content');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['trending-content'] });
      queryClient.invalidateQueries({ queryKey: ['top-rated-content'] });
      toast.success('New content added to catalogue!');
    }
  });
}

export function useAdminUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update content');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['content-item', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['trending-content'] });
      queryClient.invalidateQueries({ queryKey: ['top-rated-content'] });
      toast.success('Content updated successfully.');
    }
  });
}

export function useAdminDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contentId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`/api/admin/content?id=${encodeURIComponent(contentId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete content');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['trending-content'] });
      queryClient.invalidateQueries({ queryKey: ['top-rated-content'] });
      toast.success('Content removed from catalogue.');
    }
  });
}

// 2. Admin Reviews Moderation
export function useAdminReviews(status?: string) {
  return useQuery({
    queryKey: ['admin-reviews', status],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const url = status ? `/api/admin/reviews?status=${encodeURIComponent(status)}` : '/api/admin/reviews';
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch reviews');
      }
      return res.json();
    }
  });
}

export function useAdminModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, status }: { reviewId: string; status: 'approved' | 'pending' | 'rejected' }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: reviewId, status })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to moderate review');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['content-item'] });
      toast.success('Review status updated.');
    }
  });
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(reviewId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete review');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['content-item'] });
      toast.success('Review deleted permanently.');
    }
  });
}
