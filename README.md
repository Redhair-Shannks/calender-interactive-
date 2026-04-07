# Interactive Wall Calendar Component ✨

A premium, feature-rich React calendar component built with **Next.js 16**, featuring smooth animations, responsive design, and an impressive user experience designed to showcase frontend engineering excellence.

## 🎯 Core Features

### Wall Calendar Aesthetic
- Beautiful hero image display with gradient overlays and vignette effects
- Decorative wall calendar rings (like physical wall calendars)
- Premium card design with glassmorphism effects
- Smooth zoom animation on image hover

### Date Range Selection
- Intuitive date range picker with multi-click logic
- Visual states for start date (blue gradient), end date, and date ranges
- Today indicator with amber highlighting
- Clear selection button with smooth animations

### Integrated Notes System
- **Monthly Memos**: General notes unique to each month
- **Range Notes**: Specific notes for selected date ranges
- Auto-saving with visual feedback (✓ Saved!)
- localStorage persistence across sessions
- Animated character counters

### Custom Hero Images
- Upload custom images for each month
- One-click reset to default images
- Image upload interface only appears on hover
- Smooth image transitions between months

### Holiday Markers
- Auto-detected holidays (New Year, Valentine's, Halloween, Christmas, etc.)
- Emoji indicators on calendar dates
- Easily customizable in CalendarGrid component

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Recommended: 20.x LTS)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wallpaper-app

# Install dependencies
npm install
# or pnpm install / yarn install / bun install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the calendar in action. The page auto-updates as you edit files.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata & fonts
│   ├── page.tsx                # Main page with background effects
│   └── globals.css             # Global styles, animations, design tokens
├── components/
│   ├── Calendar.tsx            # Main container with month navigation
│   ├── CalendarGrid.tsx        # Calendar grid with date selection
│   ├── HeroImage.tsx           # Hero image with upload functionality
│   ├── NotesPanel.tsx          # Dual-layer notes system
│   └── ui/                     # shadcn/ui components (button, card, textarea)
├── lib/
│   ├── calendar-utils.ts       # Calendar logic (date generation, ranges)
│   └── utils.ts                # General utilities (cn, etc.)
└── public/                     # Static assets
```

## 🎨 Design & Styling

### Premium Color Palette
- **Primary Blue**: `oklch(0.35 0.15 250)` - Professional trust
- **Accent Gold**: `oklch(0.68 0.25 45)` - Warmth & attention
- **Neutrals**: Cream to Slate - Clean & sophisticated
- **Gradients**: Subtle blends for depth

### Typography
- **Headings**: Bold, wide tracking for premium feel
- **Body**: Clear hierarchy with responsive sizing
- **Labels**: Small caps for sophisticated UI

### Animations
- **Entry**: Staggered fade-in for calendar dates
- **Interactions**: Scale transforms on hover/tap
- **Transitions**: Smooth 3D page flips between months
- **Micro**: Animated icons, button states, save feedback

## 🛠 Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | Full-stack React framework with App Router |
| **Framer Motion** | Declarative animations & interactions |
| **Tailwind CSS v4** | Utility-first CSS with semantic tokens |
| **shadcn/ui** | Accessible UI component library |
| **date-fns** | Modern date manipulation |
| **Lucide React** | Premium icon library |
| **React 19.2** | Latest React features & optimizations |

## ✨ Key Technical Highlights

### State Management
- Efficient React hooks (useState, useEffect)
- No external state management needed
- Optimized re-renders with proper dependency arrays

### Performance
- Framer Motion for GPU-accelerated animations
- Lazy animations with staggered delays
- Optimized image loading with next/image patterns
- Minimal bundle size

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: sm, md, lg
- Touch-friendly button sizing
- Flexible grid layouts
- Reordered layout on mobile (notes below calendar)

### Data Persistence
- localStorage for notes (both monthly & range)
- localStorage for custom hero images
- Base64 encoded image storage
- No backend required (client-side only)

### Code Quality
- Clean component separation
- Consistent naming conventions
- Proper TypeScript interfaces
- Well-organized utility functions
- Semantic HTML structure

## 🎯 Interview Talking Points

1. **Component Architecture**: Each component has a single responsibility (Calendar → CalendarGrid, HeroImage, NotesPanel)
2. **State Management**: Efficient React hooks without Redux/Context for simplicity
3. **Animation Strategy**: Framer Motion declarative API for smooth, performant animations
4. **Responsive Design**: Mobile-first with Tailwind utilities, tested across devices
5. **Data Persistence**: localStorage strategy for offline-first UX
6. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
7. **Performance**: No unnecessary re-renders, GPU-accelerated animations
8. **Scalability**: Easy to add features (recurring events, categories, sharing, etc.)
9. **User Experience**: Thoughtful interactions, visual feedback, smooth transitions
10. **Code Organization**: Modular, maintainable codebase ready for production

## 🎬 Video Demo Highlights

When recording your demo, showcase:
- ✅ Month navigation with smooth transitions
- ✅ Date range selection (click start → click end)
- ✅ Range note-taking
- ✅ General monthly notes
- ✅ Image upload for custom hero images
- ✅ Mobile responsiveness (resize browser or use DevTools)
- ✅ Holiday markers on specific dates
- ✅ Smooth animations throughout
- ✅ Local storage persistence (refresh page → data persists)

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
```bash
npm run build
npm start
```

## 📋 Checklist for Interview Success

- [ ] Test all features thoroughly
- [ ] Record a demo video (2-3 minutes)
- [ ] Push clean code to GitHub
- [ ] Deploy to live URL (Vercel)
- [ ] Write clear commit messages
- [ ] Document any custom decisions
- [ ] Test on mobile devices
- [ ] Verify localStorage works across page refreshes
- [ ] Check animation performance
- [ ] Be ready to discuss trade-offs

## 🎓 Learning Resources Used

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [date-fns](https://date-fns.org/)

## 📄 License

MIT License - Build something amazing with this! 🚀

---

**Built with ❤️ for technical interviews. Good luck! 🎉**
