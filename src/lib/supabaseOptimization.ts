import { createClient } from '@supabase/supabase-js';
import { useQuery, useQueries } from '@tanstack/react-query';

// Initialize with proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Cache configuration
const CACHE_TIMES = {
  CONTENT: 5 * 60 * 1000, // 5 minutes
  TRENDING: 10 * 60 * 1000, // 10 minutes
  SEARCH: 15 * 60 * 1000, // 15 minutes
  USER: 1 * 60 * 1000, // 1 minute
  ADMIN: 2 * 60 * 1000, // 2 minutes
} as const;

// Optimized query hooks with built-in caching
export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  cacheTime: number = CACHE_TIMES.CONTENT,
  enabled: boolean = true
) {
  return useQuery<T>({
    queryKey,
    queryFn,
    staleTime: cacheTime,
    gcTime: cacheTime * 2,
    enabled,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Batch query optimizer - reduces N+1 queries
export function useBatchQueries<T>(
  queryConfigs: Array<{
    queryKey: string[];
    queryFn: () => Promise<T>;
    enabled?: boolean;
  }>
) {
  return useQueries({
    queries: queryConfigs.map((config) => ({
      queryKey: config.queryKey,
      queryFn: config.queryFn,
      staleTime: CACHE_TIMES.CONTENT,
      gcTime: CACHE_TIMES.CONTENT * 2,
      enabled: config.enabled !== false,
      retry: 2,
    })),
  });
}

// Pagination helper with optimized limits
export function getPaginationParams(page: number = 1, pageSize: number = 20) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to, pageSize };
}

// Index-aware filtering strategies
export function buildOptimizedFilter(filters: Record<string, any>) {
  const whereConditions: string[] = [];
  
  // Apply filters in order of selectivity (most selective first)
  if (filters.id) {
    whereConditions.push(`id.eq.${filters.id}`);
  }
  if (filters.status) {
    whereConditions.push(`status.eq.${filters.status}`);
  }
  if (filters.category) {
    whereConditions.push(`category.eq.${filters.category}`);
  }
  if (filters.createdAfter) {
    whereConditions.push(`created_at.gte.${filters.createdAfter}`);
  }
  
  return whereConditions.join('&');
}

// Prefetch common queries on idle
export async function prefetchCommonQueries() {
  if (!('requestIdleCallback' in window)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    requestIdleCallback(async () => {
      try {
        // Prefetch trending content
        const response = await supabase
          .from('contents')
          .select('id,title,poster,rating')
          .eq('status', 'published')
          .order('views', { ascending: false })
          .limit(50);

        // Prefetch top-rated
        await supabase
          .from('contents')
          .select('id,title,poster,rating')
          .eq('status', 'published')
          .order('rating', { ascending: false })
          .limit(50);

        resolve(response);
      } catch (error) {
        console.error('Prefetch error:', error);
        resolve(null);
      }
    }, { timeout: 3000 });
  });
}

// Real-time subscription with automatic cleanup
export function subscribeToTable(table: string, callback: (payload: any) => void) {
  const subscription = supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// Bulk operations optimizer
export async function bulkInsert<T extends Record<string, any>>(
  table: string,
  records: T[],
  chunkSize: number = 100
) {
  const chunks = [];
  for (let i = 0; i < records.length; i += chunkSize) {
    chunks.push(records.slice(i, i + chunkSize));
  }

  const results = [];
  for (const chunk of chunks) {
    const { data, error } = await supabase
      .from(table)
      .insert(chunk)
      .select();

    if (error) throw error;
    results.push(data);
  }

  return results.flat();
}

// Efficient update with change detection
export async function smartUpdate<T extends Record<string, any>>(
  table: string,
  id: string,
  newValues: Partial<T>
) {
  // Only update changed fields
  const { data: current } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  const changes: Partial<T> = {};
  Object.entries(newValues).forEach(([key, value]) => {
    if ((current as any)?.[key] !== value) {
      (changes as any)[key] = value;
    }
  });

  if (Object.keys(changes).length === 0) {
    return current;
  }

  const { data, error } = await supabase
    .from(table)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// RLS-aware auth helper
export async function withAuth<T>(
  fn: (userId: string) => Promise<T>
): Promise<T> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not authenticated');
  }

  return fn(user.id);
}

// Error recovery with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Connection pool status
export async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('contents').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
