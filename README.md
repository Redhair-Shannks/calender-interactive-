# Interactive Wall Calendar Component ✨

A premium, feature-rich React calendar application built with **Next.js 16**, featuring 3D animations, a dual-layer notes system, and a tactile "physical-to-digital" user experience.

## 🎯 Design Philosophy & Choices

This project was designed with **Tactile Digitalism** at its core—the idea that digital tools should retain the intuitive, satisfying feel of their physical counterparts.

### 1. The Physical Metaphor (UI/UX)
- **Spiral Binding & Paper Textures**: Rather than a flat grid, the calendar uses decorative spiral rings and subtle ruled-paper backgrounds. This creates a psychological "bridge" that makes the application feel like a companion object rather than just a website.
- **Visual Chronology**: The use of a Hero Image per month reinforces the seasonal feel of a wall calendar. I chose to allow user uploads to ensure the calendar feels personal and adaptable.
- **Glassmorphism & Depth**: Multi-layered shadows and backdrop blurs are used across panels to create hierarchy and focus without sacrificing the "airy" feel of the interface.

### 2. Information Architecture
- **Dual-Layer Notes**: I implemented both **Monthly Memos** (for high-level intentions/reflections) and **Specific Notes** (for date-range events). This choice satisfies two different user needs: long-term planning and short-term scheduling.
- **Color-Coded Taxonomy**: Tags (Personal, Work, Dream, etc.) are color-coded with consistent tokens across the grid and the event list, allowing for instant cognitive categorization.

### 3. Motion as Feedback
- **Page Turn Animation**: I rejected standard sliding transitions in favor of a **3D hinged flip**. This reinforces the "physical object" metaphor and provides a clear spatial cue that the user is moving between months.
- **Staggered Entry**: The calendar grid uses motion-staggering for date cells, making the interface feel "alive" and preventing the visual fatigue of a static layout pop-in.

## 🛠 Technical Architecture

The technology stack was chosen to maximize performance while providing a "state-of-the-art" development experience.

### 1. High-Performance Rendering
- **Next.js 16 & React 19**: Leverages the latest App Router patterns for optimized routing and hydration.
- **Framer Motion**: Used for all animations. I chose this over basic CSS transitions because it allows for complex 3D math and gesture-based interruptions that feel organic to the user.
- **Tailwind CSS v4**: Utilizing the next-gen alpha features for a CSS-only design system that minimizes the JavaScript footprint of the styling layer.

### 2. State & Persistence
- **Zero-Backend Persistence**: All events, custom images, and memos are stored in `localStorage`. This architectural choice ensures the app is 100% functional offline and requires zero server configuration while maintaining a "logged-in" feel.
- **Modular Component Design**: The logic is strictly decoupled. `CalendarGrid` handles only coordinate math and selection, while `NotesPanel` manages data entry. This makes the codebase highly maintainable and easy to extend.

### 3. Readability & Accessibility
- **The Contrast Choice**: In light mode, I opted for a pure `#FFFFFF` background with high-contrast `#000000` text for unselected state elements. This ensures the app is readable in all lighting conditions and meets high accessibility standards.

## 🚀 Running the Project Locally

### 1. Prerequisites
- **Node.js**: 18.x or higher
- **Package Manager**: npm

### 2. Setup
```bash
# Clone and enter directory
git clone <your-repo-url>
cd wallpaper-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Production Build
```bash
npm run build
npm start
```

## 📁 Project Map
- `/app`: Global styles, layout, and theme context.
- `/components`: Modular UI parts (Calendar, Hero, Notes, Events).
- `/lib`: Pure utility functions for date math and color constants.

---

**This codebase stands as a demonstration of how a standard utility (a calendar) can be elevated into a premium product through thoughtful animation, tactile design, and robust React architecture.**

Built with ❤️ for Technical Excellence. 🚀

