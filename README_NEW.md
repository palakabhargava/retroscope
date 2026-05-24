# RetroScope 🎬

**A premium cinematic OTT platform** combining Netflix-style streaming, Crunchyroll anime discovery, IMDb ratings, and Prime Video's vast catalog into one **recruiter-grade full-stack application**.

---

## ✨ Features

### 🎭 Multiverse Content System
- **Movie Universe**: Curated film catalog with mood-based discovery
- **Anime Universe**: Neon-aesthetic anime library with trending/top-rated sections
- **Classics Universe**: Retro cinema with sepia-tone atmosphere
- **Mature 18+ Universe**: Noir & thriller content with age verification
- **Kids Universe**: Colorful, family-friendly content

### 🎨 Dynamic Palette Engine
Every content item dynamically affects the UI:
- Cinematic ambient glows
- Gradient backgrounds that match content mood
- Real-time color-coded sections
- Atmospheric shadows and lighting

### 📱 Mobile-First Optimization
- **44px+ touch targets** for accessibility
- Safe area support for notch devices
- Responsive grid layouts (2-8 columns)
- Swipe gestures and snap scrolling
- Bottom navigation with 6+ main sections
- Fullscreen player with mobile controls
- Device orientation detection

### ⚡ Performance Features
- **Code splitting** per route with Vite
- **Lazy loading** with skeleton placeholders
- **Virtual scrolling** for large lists
- **Image optimization** with fallback chains
- **Query caching** with TanStack Query
- **Batch operations** for API efficiency
- **Prefetching** on idle callback

### 🔐 Advanced Auth & Age Verification
- Supabase RLS (Row-Level Security)
- JWT authentication
- Age verification modal with:
  - localStorage persistence (30 days)
  - Supabase tracking (privacy-aware IP hashing)
  - Required before 18+ content access

### 📊 Admin Command Center
- Cinematic dashboard with analytics
- Real-time charts (views, revenue, users)
- System health monitoring
- Active issues tracker
- Content management CRUD
- User moderation tools
- Telemetry visualizations

### 🖼️ Image Loading System
- **Fallback chain** per image type:
  - Primary URL → Unsplash fallback → Gradient placeholder
- **Blur-up** low-res placeholders
- **Shimmer** loading states
- **Cinematic fallback artworks** by atmosphere
- **Retry logic** with exponential backoff
- **Responsive sizing** per breakpoint

---

## 🏗️ Architecture

### Tech Stack
```
Frontend:
├── React 19 (with hooks)
├── TypeScript
├── TanStack Router (file-based routing)
├── TanStack Query (state management)
├── Tailwind CSS 4
├── Framer Motion (animations)
├── Radix UI (components)
└── Vite (bundling)

Backend:
├── Supabase (PostgreSQL + Auth)
├── Edge Functions (optional)
├── RLS Policies (security)
└── Real-time Subscriptions

Deployment:
├── Vercel (frontend)
├── Supabase Cloud (backend)
└── CDN (image optimization)
```

### Folder Structure
```
retroscope/
├── src/
│   ├── routes/              # TanStack Router file-based routes
│   │   ├── index.tsx        # Home page
│   │   ├── anime.tsx        # Anime universe
│   │   ├── classics.tsx     # Classics universe
│   │   ├── mature.tsx       # 18+ universe
│   │   ├── movies.$movieId.tsx # Detail page with player
│   │   ├── search.tsx       # Search & filters
│   │   ├── _authenticated/  # Protected routes (auth required)
│   │   │   ├── admin.tsx    # Admin routes
│   │   │   ├── watchlist.tsx
│   │   │   └── profile.tsx
│   │   └── __root.tsx       # Root layout
│   │
│   ├── components/
│   │   ├── layout/          # Global layout components
│   │   │   ├── TopNav.tsx   # Header navigation
│   │   │   ├── MobileNav.tsx    # Bottom mobile nav
│   │   │   ├── Footer.tsx
│   │   │   ├── PageSkeletons.tsx
│   │   │   └── SEOHelper.tsx
│   │   ├── movie/           # Movie/content components
│   │   │   ├── PosterCard.tsx   # Responsive poster grid
│   │   │   ├── MovieRow.tsx     # Horizontal shelf
│   │   │   ├── FakePlayerModal.tsx # Video player
│   │   │   └── VintageTicket.tsx
│   │   ├── cinematic/       # Visual effects
│   │   │   ├── FilmGrain.tsx
│   │   │   ├── ProjectorBeam.tsx
│   │   │   ├── DustParticles.tsx
│   │   │   └── CinematicImage.tsx
│   │   ├── admin/           # Admin dashboard
│   │   │   └── CommandCenter.tsx
│   │   ├── ui/              # Radix UI + custom components
│   │   │   ├── CinematicImage.tsx
│   │   │   └── ...shadcn components
│   │   └── premium/         # Premium features
│   │
│   ├── hooks/
│   │   ├── queries.ts       # TanStack Query hooks
│   │   ├── useAtmosphere.tsx    # Dynamic palette context
│   │   └── useMobileOptimization.ts # Mobile utilities
│   │
│   ├── lib/
│   │   ├── auth.tsx         # Supabase auth context
│   │   ├── utils.ts         # Helper functions
│   │   ├── imageOptimization.ts # Image fallbacks & caching
│   │   ├── responsiveUtilities.ts # Tailwind breakpoints
│   │   ├── performanceUtils.ts # Skeletons, lazy loading
│   │   ├── ageVerification.tsx # Age gate with tracking
│   │   └── supabaseOptimization.ts # Query optimization
│   │
│   ├── integrations/        # Third-party integrations
│   │   └── supabase.ts
│   │
│   ├── data/
│   │   ├── demoContent.ts   # Demo movie/anime data
│   │   ├── castData.ts      # Actor information
│   │   ├── movies.ts        # Movie database schema
│   │   └── discoveryData.ts # Recommendation logic
│   │
│   ├── styles.css           # Global styles + mobile utilities
│   ├── main.tsx             # Entry point
│   └── router.tsx           # Router config
│
├── public/
│   ├── robots.txt           # SEO
│   └── sitemap.xml
│
├── supabase/
│   ├── config.toml          # Supabase config
│   └── migrations/          # Database migrations
│
├── vite.config.ts           # Build optimization
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind customization
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun 1.0+)
- Supabase account
- npm/yarn/bun package manager

### Installation

1. **Clone & Install**
```bash
git clone <repo-url>
cd retroscope
npm install
```

2. **Setup Supabase**
```bash
# Create project at supabase.com
# Get API keys from project settings

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

3. **Database Setup**
```bash
# Run migrations
supabase link --project-ref <PROJECT_ID>
supabase db push
```

4. **Development Server**
```bash
npm run dev
# Visit http://localhost:8080
```

### Environment Variables (.env.local)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000
```

---

## 📊 Performance Optimizations

### Bundle Size Reduction
- **Code splitting** by route (automatic with Vite plugin)
- **Vendor chunks** separated (React, UI, animations, forms, utils)
- **CSS code splitting** per route
- **Tree-shaking** of unused code
- **Minification** & terser compression

### Load Time Improvements
- **Image optimization**: WebP, responsive sizing, lazy loading
- **Route prefetching**: on idle callback
- **Query caching**: 5-15 min based on content type
- **Skeleton placeholders**: instant visual feedback
- **Shimmer animations**: perceived performance

### Mobile Optimizations
- **Mobile-first CSS** (Tailwind)
- **Touch-friendly targets**: 44x44px minimum
- **Responsive layouts**: 2-8 column grids
- **Safe area insets**: notch device support
- **Swipe gestures**: Framer Motion
- **GPU acceleration**: transform + will-change

### Database Optimization
- **Indexed queries**: on id, status, created_at
- **RLS policies**: row-level security
- **Connection pooling**: Supabase managed
- **Batch inserts**: reduce roundtrips
- **Smart updates**: only changed fields
- **Caching layer**: client-side with localStorage

---

## 🔐 Security

### Authentication
- Supabase JWT tokens
- Auto-refresh on token expiry
- Secure session storage
- Protected routes (authentication guard)

### Authorization
- RLS policies per table
- User-based access control
- Admin-only endpoints
- Age verification tracking

### Privacy
- IP hashing for age verification
- GDPR-compliant data storage
- No third-party tracking
- Secure password hashing (bcrypt)

---

## 👥 Admin Features

### Dashboard
Access at `/admin` (authenticated users only)

**Features:**
- 📊 Analytics: Views, users, revenue trends
- 📈 Charts: Revenue breakdown, user growth
- 🚨 Issues: Active alerts and system status
- 💚 Health: Database, API, CDN, cache status

### Content Management
- Add/edit/delete movies
- Manage anime collections
- Update ratings & metadata
- Upload posters & banners

### User Management
- View active users
- Track engagement
- Age verification logs
- Suspend/ban users

### Moderation
- Flag inappropriate content
- Review user reports
- Monitor comments
- System logs

---

## 📱 Mobile Testing Checklist

- [ ] Touch targets are ≥44px
- [ ] Bottom nav is accessible
- [ ] Fullscreen player works
- [ ] Images load with fallbacks
- [ ] No horizontal scroll on mobile
- [ ] Safe area support (notch)
- [ ] Swipe gestures responsive
- [ ] Landscape orientation works
- [ ] Tap-friendly buttons
- [ ] No layout shift (CLS)

---

## 🧪 Testing & Debugging

### Demo Credentials
```
Email: demo@retroscope.app
Password: DemoPassword123!
```

### Test Content
- 500+ movies across genres
- 200+ anime titles
- 100+ classic films
- 50+ mature/noir content
- 100+ kids content

### Lighthouse Targets
- **Performance**: 85+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 95+

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Connect GitHub repo
# Auto-deploy on push
# Set environment variables in dashboard

vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

vercel --prod
```

### Docker (Alternative)
```bash
docker build -t retroscope .
docker run -p 3000:3000 retroscope
```

### Self-Hosted
```bash
npm run build
# dist/ folder is production-ready
# Serve with any static host (nginx, Apache, etc.)
```

---

## 📚 API Documentation

### Supabase Tables
```sql
-- Contents (movies, anime, etc)
create table contents (
  id uuid primary key,
  title varchar,
  description text,
  poster url,
  banner url,
  video_url url,
  rating float,
  year int,
  genres text[],
  atmosphere varchar,
  moods text[],
  runtime int,
  views int,
  status enum ('draft', 'published', 'archived')
);

-- Users (auth + profile)
create table users (
  id uuid primary key,
  email varchar unique,
  name varchar,
  avatar_url url,
  age_verified boolean,
  age_verified_at timestamp,
  created_at timestamp
);

-- Watchlist
create table watchlist (
  id uuid primary key,
  user_id uuid references users(id),
  content_id uuid references contents(id),
  added_at timestamp
);

-- Age Verifications (tracking)
create table age_verifications (
  id uuid primary key,
  user_id uuid references users(id),
  verified boolean,
  verified_at timestamp,
  ip_hash varchar
);
```

---

## 🔧 Advanced Configuration

### Tailwind Customization
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#FFD700', // Projector gold
        background: '#0A0A0A', // Deep black
        // ... more colors
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
}
```

### TanStack Router Configuration
```ts
// src/router.tsx
export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreloadDelay: 50,
});
```

---

## 📈 Growth Roadmap

### Phase 1 ✅
- [x] Core OTT platform
- [x] Movie discovery
- [x] Anime universe
- [x] Player integration
- [x] Mobile optimization
- [x] Age verification
- [x] Admin dashboard

### Phase 2 🚀
- [ ] Live streaming
- [ ] Social features (comments, reviews)
- [ ] Watchlist sharing
- [ ] Genre recommendations ML
- [ ] Payment integration (Stripe)
- [ ] Multi-language support
- [ ] Offline downloads

### Phase 3 🌟
- [ ] VR/AR viewing
- [ ] AI-powered recommendations
- [ ] Creator tools
- [ ] Community forums
- [ ] Mobile app (React Native)
- [ ] Global expansion

---

## 🆘 Troubleshooting

### Images Not Loading
- Check fallback URLs in `imageOptimization.ts`
- Verify CORS settings for image domains
- Check browser console for 404s

### Mobile Layout Broken
- Verify Tailwind breakpoints in responsive utilities
- Check safe area inset CSS
- Test on actual devices (not just browser dev tools)

### Supabase Connection Issues
- Verify `VITE_SUPABASE_URL` and key
- Check RLS policies aren't blocking reads
- Ensure database migrations ran

### Slow Page Loads
- Profile with Lighthouse
- Check Query cache times in `performanceUtils.ts`
- Verify image optimization is working
- Look for N+1 queries in React DevTools Profiler

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Make changes with tests
4. Submit PR with description

---

## 📄 License

MIT License - see LICENSE.md

---

## 📞 Support

- **Bugs**: Open GitHub issue
- **Features**: Discussion thread
- **Security**: security@retroscope.app

---

## 🎬 Credits

Built as a **full-stack engineering showcase** combining:
- Netflix's polished UX
- Crunchyroll's anime expertise
- IMDb's comprehensive data
- Prime Video's catalog breadth

**Made for recruiters** 👨‍💼👩‍💼

---

**RetroScope** — *Where cinema meets code.*
