# Interactive Wall Calendar Component ✨

A premium, feature-rich React calendar component built with **Next.js 16**, featuring smooth animations, responsive design, and an impressive user experience designed to showcase frontend engineering excellence.

## 🎯 Design Philosophy & User-Driven Choices

The design of this component focuses on **Tactile Digitalism**—reclaiming the physical feel of paper and ink within a high-performance digital interface. Every design choice was carefully selected to prioritize legibility, premium aesthetics, and delightful interactions.

### 🖋️ Typography & Visual Clarity
- **Enhanced Legibility**: I chose to increase font sizes for control labels and headers (e.g., "Add Note", "Upcoming Events") based on user feedback to ensure the interface remains accessible and readable even on smaller screens.
- **Micro-Copy Focus**: Labels use specialized tracking and capitalization to create a professional, magazine-style layout.

### 🌗 Atmospheric Refinements
- **Pure Canvas Background**: In Light Mode, I implemented a pure `#FFFFFF` background. This choice was made to provide maximum contrast and a clean "gallery" feel for the hero images.
- **High-Contrast Interactions**: Inactive elements (like unselected tabs) were tuned to black/dark gray in light mode to avoid "gray-out" visibility issues common in many modern UIs.

### 📖 The "Page Turn" Experience
- **Physicality via Motion**: Instead of standard sliding transitions, I implemented a custom **3D hinged page turn**. This mimics a physical book or a spiral-bound wall calendar, creating a nostalgic yet modern tactile feel.
- **Depth & Perspective**: By adjusting the 3D perspective to `2000px`, I ensured the flip feels natural and has physical weight.

## 🚀 Running the Project Locally

Follow these steps to get the calendar running on your machine:

### 1. Prerequisites
- **Node.js**: Version 18.x or higher (LTS recommended)
- **Package Manager**: npm (standard), but works with yarn, pnpm, or bun

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd wallpaper-app

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Once the server starts, open [http://localhost:3000](http://localhost:3000) in your browser. The page will hot-reload as you make changes to the source code.

### 4. Build for Production
To test the production-ready bundle:
```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata & fonts
│   ├── page.tsx                # Main entry point & theme container
│   └── globals.css             # Tailwind 4 tokens & 3D animation styles
├── components/
│   ├── Calendar.tsx            # Main component & 3D transition logic
│   ├── CalendarGrid.tsx        # Grid logic, date cells, & holiday markers
│   ├── HeroImage.tsx           # Image management & upload controls
│   ├── NotesPanel.tsx          # Dual-layer notes & monthly memo system
│   └── UpcomingEvents.tsx      # Chronological event feed
├── lib/
│   ├── calendar-utils.ts       # Date calculation & range logic
│   └── types.ts                # TypeScript interfaces
```

## 🛠 Technologies Used
- **Next.js 16** & **React 19**
- **Framer Motion**: Used for the 3D page flip and layout animations.
- **Tailwind CSS v4**: For utility-first styling with high-performance CSS tokens.
- **Lucide React**: For consistent, premium iconography.
- **date-fns**: For precise date manipulations.

---

**This project was built to demonstrate how thoughtful micro-interactions and high-contrast design can transform a standard UI component into a premium digital experience.**

Built with ❤️ for technical excellence. 🚀

