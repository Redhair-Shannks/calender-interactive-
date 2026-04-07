# Component Documentation

Detailed documentation for each component in the Interactive Wall Calendar.

## Table of Contents
1. [Calendar](#calendar)
2. [CalendarGrid](#calendargrid)
3. [HeroImage](#heroimage)
4. [NotesPanel](#notespanel)

---

## Calendar

**File**: `components/Calendar.tsx`

The main container component that orchestrates all sub-components and manages the overall application state.

### Purpose
- Manage month navigation
- Handle date selection logic
- Coordinate between child components
- Apply page-level animations

### Props
None (top-level component)

### State
```typescript
currentMonth: Date              // Currently displayed month
startDate: Date | null          // Selected date range start
endDate: Date | null            // Selected date range end
customImages: Record<...>       // Custom hero images per month
```

### Key Features

#### 1. Month Navigation
```typescript
const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
```
- Smooth transitions between months
- Can navigate backwards/forwards unlimited
- Resets selection on month change

#### 2. Date Selection Logic
```typescript
const handleDateClick = (day: Date) => {
  if (!startDate) {
    // First click: set both start and end
    setStartDate(day);
    setEndDate(day);
  } else if (startDate && endDate && isSameDay(startDate, endDate)) {
    // Second click on same date: clear
    // Second click on different date: set range
  } else {
    // Clear and restart
  }
};
```

#### 3. Image Management
- Load custom images from localStorage on mount
- Allow upload of new images
- Reset to defaults
- Store as Base64 data URLs

### Animations
- Page entry fade-in (0.6s)
- Month transition with 3D perspective
- Selection indicator animation

### Related Components
- ✅ Depends on: CalendarGrid, HeroImage, NotesPanel
- ✅ Used by: app/page.tsx

---

## CalendarGrid

**File**: `components/CalendarGrid.tsx`

Displays the calendar grid with date buttons and handles date selection visualization.

### Props
```typescript
interface CalendarGridProps {
  currentMonth: Date           // Month being displayed
  startDate: Date | null       // Range start date
  endDate: Date | null         // Range end date
  onDateClick: (day: Date) => void  // Date selection handler
}
```

### Key Features

#### 1. Calendar Generation
```typescript
const days = generateCalendarDays(currentMonth);
// Returns array of all dates needed for calendar grid
// Includes days from previous/next months for padding
```

#### 2. Visual States
Each date button can show:
- **Previous/Next Month**: Faded text
- **Today**: Amber highlight with ring
- **Range Start/End**: Blue gradient
- **In Range**: Light blue background
- **Default**: Hover on current month dates

#### 3. Holiday Markers
```typescript
const holidays: Record<string, string> = {
  "1-1": "🎆 New Year",
  "2-14": "❤️ Valentine's",
  // ... more holidays
};
```
- Automatically detected from date
- Shows emoji indicator
- Easily customizable

#### 4. Animations
- **Staggered Entry**: Each date fades in with delay
- **Hover**: Scale 1.1, move up 4px
- **Tap**: Scale 0.92 (tactile feedback)
- **Holiday Emoji**: Bounce animation

### Responsive Behavior
- **Mobile** (sm): Smaller gaps, smaller text
- **Tablet** (md): Medium sizing
- **Desktop** (lg): Full sizing

### Related Components
- ✅ Depends on: date-fns, framer-motion
- ✅ Used by: Calendar

---

## HeroImage

**File**: `components/HeroImage.tsx`

Displays a large hero image at the top of the calendar with upload and customization features.

### Props
```typescript
interface HeroImageProps {
  currentMonth: Date
  imageUrl: string                    // URL to display
  monthIndex: number                  // Month (0-11)
  onUpload: (monthIndex, dataUrl) => void
  onReset: (monthIndex) => void
}
```

### Key Features

#### 1. Image Display
- Hero image with zoom on hover
- Gradient overlays for visual hierarchy
- Vignette effect for depth

#### 2. Month Display Card
- Year and month name overlay
- Bottom-right positioning
- Glassmorphism styling with backdrop blur
- Staggered animation entry

#### 3. Decorative Wall Calendar Rings
- 5 rings simulating physical wall calendar
- Animated entry with staggered delays
- Hover-interactive upload controls

#### 4. Image Upload
```typescript
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target?.result as string;
    onUpload(monthIndex, dataUrl);
  };
  reader.readAsDataURL(file);
};
```

- Accepts any image format
- Converts to Base64 data URL
- Stores in localStorage
- Immediately visible

#### 5. Controls (Hover Only)
- "Change Image" button opens file picker
- "Reset" button restores default image
- Smooth opacity transition on hover
- Touch-friendly on mobile

### Image Sources
Default images from Picsum Photos (ID-based):
- Rotates through different scenic images
- One unique image per month
- High quality (1200x800px)

### Responsive Behavior
- **Mobile**: h-56 (smaller hero)
- **Tablet**: h-72
- **Desktop**: h-96 (full height)

### Related Components
- ✅ Depends on: lucide-react, framer-motion
- ✅ Used by: Calendar

---

## NotesPanel

**File**: `components/NotesPanel.tsx`

Sidebar component for managing notes associated with months and date ranges.

### Props
```typescript
interface NotesPanelProps {
  startDate: Date | null      // Selected range start
  endDate: Date | null        // Selected range end
  monthIndex: number          // Current month
}
```

### Key Features

#### 1. Dual-Layer Notes System

**Monthly Memos**
- Unique per month
- Stored with month index as key
- Shows character count
- Persists across sessions

**Range Notes**
- Only shows when date range selected
- Specific to start/end dates
- Stored globally (shared across months)
- Animated entry/exit

#### 2. Auto-Save Feedback
```typescript
const handleSave = () => {
  // Save to localStorage
  setJustSaved(true);
  setTimeout(() => setJustSaved(false), 2000);
};
```

Button shows:
- 💾 "Save Notes" (default)
- ✓ "Saved!" (after click, 2s)

#### 3. Visual Design
- Amber/orange gradient background
- Animated book icon (rotating)
- Glass-morphism effect
- Character counters

#### 4. Data Persistence
```typescript
// Monthly notes
localStorage.setItem(
  `calendar-general-notes-${monthIndex}`,
  generalNotes
);

// Range notes
localStorage.setItem(
  "calendar-range-notes",
  JSON.stringify(rangeNotes)
);
```

### localStorage Schema
```javascript
{
  "calendar-general-notes-0": "content",    // January notes
  "calendar-general-notes-1": "content",    // February notes
  // ... one per month
  "calendar-range-notes": {
    "Mon Jan 01 2025-Wed Jan 08 2025": "range note content",
    // ... one per range
  }
}
```

### Responsive Behavior
- **Mobile**: Full width (below calendar)
- **Tablet/Desktop**: Sidebar (left side)
- Layout reordering with `order-1 lg:order-2`
- Touch-friendly textarea sizing

### Related Components
- ✅ Depends on: shadcn/ui, framer-motion
- ✅ Used by: Calendar

---

## Utility Components (shadcn/ui)

### Button
- Used for month navigation and actions
- Variants: ghost, secondary, outline
- Hover and tap animations

### Card
- Container for main layout
- Shadow and border styling
- Responsive rounded corners

### Textarea
- For note input
- Resize disabled
- Custom border colors per use case

### Separator
- Visual dividers (if used)
- Responsive spacing

---

## Data Flow Diagram

```
Calendar (Container)
│
├─► HeroImage
│   └─ onUpload, onReset
│       └─ Update customImages state
│           └─ Save to localStorage
│
├─► CalendarGrid
│   └─ startDate, endDate (props)
│   └─ onDateClick
│       └─ Update date selection
│
└─► NotesPanel
    └─ startDate, endDate (props)
    └─ monthIndex
        └─ Display context-aware notes
        └─ Save to localStorage
```

---

## State Management Flow

### On Month Change
1. prevMonth/nextMonth called
2. currentMonth updated
3. CalendarGrid re-renders with new month
4. HeroImage displays new month's image
5. NotesPanel loads new month's notes

### On Date Click
1. handleDateClick called
2. startDate/endDate updated
3. CalendarGrid re-renders (visual states change)
4. NotesPanel appears/updates based on range

### On Note Save
1. handleSave called
2. Data written to localStorage
3. Visual feedback (✓ Saved!) shown
4. Auto-dismisses after 2 seconds

---

## Testing Considerations

### Unit Tests (utilities)
- `generateCalendarDays`: Edge cases (leap years, month boundaries)
- `isInRange`: Various date combinations
- `formatDateRange`: Single day vs. range formatting

### Component Tests
- Calendar month navigation (prev/next)
- Date selection logic (single, range, clear)
- Note saving and loading
- Image upload and reset

### Integration Tests
- Full user flow: select dates → add notes → refresh
- localStorage persistence
- Month changes clear selection appropriately

### E2E Tests
- Mobile responsiveness
- Touch interactions
- All features working together

---

## Common Issues & Solutions

### Issue: Notes disappear on month change
**Cause**: General notes are per-month; range notes are shared
**Solution**: This is intentional. Use range notes for cross-month notes.

### Issue: Images not loading
**Cause**: File too large or localStorage quota exceeded
**Solution**: Compress images or implement image optimization

### Issue: Date range incorrect
**Cause**: Timezone handling in date comparisons
**Solution**: Use date-fns for all comparisons

### Issue: Animations stuttering on mobile
**Cause**: Too many simultaneous animations
**Solution**: Stagger animations with delays (already implemented)

---

## Performance Tips

1. **Don't animate layout properties** (width, height)
   - Use transform/opacity instead

2. **Use GPU-accelerated properties**
   - transform, opacity, filter

3. **Keep transitions < 400ms**
   - Faster feels snappier

4. **Stagger heavy animations**
   - Don't animate 42 dates simultaneously

5. **Use React.memo for expensive renders**
   - Though not necessary here due to small component tree

---

## Accessibility Notes

- ✅ Semantic HTML (`<button>`, semantic date structure)
- ✅ ARIA labels on icon buttons
- ✅ Keyboard navigation (tab through buttons)
- ✅ Color contrast WCAG AA
- ✅ Focus visible on buttons

**To Improve:**
- Add aria-live region for save confirmation
- Announce selected date range to screen readers
- Add keyboard shortcuts (← → for navigation)
- Test with VoiceOver/NVDA

---

## Extension Ideas

Want to extend this project? Try adding:

1. **Recurring Events**: Show same event on multiple dates
2. **Categories**: Color-code notes by category
3. **Reminders**: Notification for upcoming dates
4. **Sharing**: Share calendar URL with others
5. **Dark Mode**: Add theme switcher
6. **Export**: Download calendar as PDF/image
7. **Sync**: Sync across devices
8. **Collaboration**: Multiple users editing same calendar
9. **Templates**: Quick note templates
10. **Search**: Find dates by note content

---

**Last Updated**: April 2026
**Maintainer**: Your Name
**License**: MIT
