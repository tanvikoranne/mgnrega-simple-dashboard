# MGNREGA District Dashboard Design Guidelines

## Design Approach & Philosophy

**Selected Framework:** Material Design 3 with civic/government adaptations
- Government service requiring clarity, trust, and accessibility
- Mobile-first for low-end Android devices common in rural India
- Information-dense with strong visual hierarchy
- Icon-driven interface for low-literacy accessibility

**Core Design Principles:**
1. **Extreme Clarity:** Every element must be immediately understandable
2. **Visual Communication First:** Icons, colors, and pictograms over text
3. **Touch-Optimized:** Minimum 48px touch targets for outdoor/low-accuracy use
4. **Performance-Conscious:** Lightweight design for slow networks and basic devices

## Typography

**Font Selection:**
- Primary: Noto Sans (supports Devanagari for Marathi seamlessly)
- Installed via Google Fonts CDN
- Single family with multiple weights for performance

**Type Scale:**
- Hero Numbers (KPI values): 48px-64px, Bold (font-bold)
- Section Headers: 24px-32px, Semibold (font-semibold)
- Body Text: 16px-18px, Regular (font-normal)
- Supporting Text/Labels: 14px, Medium (font-medium)
- Minimum font size: 14px for all interactive elements

**Hierarchy Rules:**
- KPI numbers are always the largest element in their card
- Metric labels sit directly below numbers in smaller, medium-weight font
- Explanatory text uses regular weight at reduced size
- Bilingual text stacks vertically (English on top, Marathi below) with equal visual weight

## Layout System

**Spacing Primitives (Tailwind):**
Core spacing units: 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4, p-6 (mobile), p-8 (desktop)
- Card spacing: mb-4, gap-4 between grid items
- Section spacing: mb-8, mb-12 between major sections
- Touch target padding: p-4 minimum
- Icon spacing: gap-2, gap-3 for icon-text pairs

**Grid Structure:**
- Mobile (default): Single column, full-width cards
- Tablet (md:): 2-column grid for comparison cards
- Desktop (lg:): 3-column maximum for KPI grids
- Container max-width: max-w-7xl
- Consistent horizontal padding: px-4 (mobile), px-6 (tablet), px-8 (desktop)

## Component Library

### Navigation & Controls
**Top App Bar:**
- Fixed position with shadow for depth
- Height: 64px (h-16) for easy reach
- Contains: Back button (if nested), District name, Language toggle, Menu icon
- Sticky during scroll for persistent access

**District Selector:**
- Large dropdown with search functionality
- Height: 56px touch target
- Icon: Location pin (Heroicons: MapPinIcon)
- Auto-detect button with geolocation icon prominently displayed
- Dropdown items: 48px height minimum with district name + code

**Bottom Navigation (Mobile):**
- 5 primary sections: Dashboard, Trends, Compare, Alerts, Reports
- Icons from Heroicons: ChartBarIcon, ArrowTrendingUpIcon, ArrowsRightLeftIcon, BellAlertIcon, DocumentArrowDownIcon
- Height: 64px with labels below icons
- Active state: filled icon variant

### Dashboard Cards

**KPI Metric Cards:**
- Prominent card elevation with rounded corners (rounded-xl)
- Layout per card:
  - Top: Large icon (32px-48px) in circular background
  - Center: Hero number (48px-64px bold)
  - Below number: Metric label (16px)
  - Bottom: Trend indicator (arrow + percentage) and audio help button
- Minimum height: 180px
- Grid: 2-column on mobile (for key metrics), 3-column on tablet+

**Icon Mapping for KPIs:**
- Workers Employed: UsersIcon
- Person-Days Generated: ClockIcon
- Wages Paid: CurrencyRupeeIcon
- Assets Created: BuildingLibraryIcon (or WrenchScrewdriverIcon)
- Work Completion: CheckBadgeIcon

**Trend Indicators:**
- Up Arrow: ArrowUpIcon (green background)
- Down Arrow: ArrowDownIcon (red background)
- Stable: ArrowRightIcon (yellow/amber background)
- Arrow size: 20px, always visible
- Percentage change shown next to arrow

**Audio Help Buttons:**
- Icon: SpeakerWaveIcon (24px)
- Circular button (rounded-full)
- Size: 48px × 48px touch target
- Position: Bottom-right corner of each card
- Persistent visibility (not hidden)

### Trend View Components

**12-Month Timeline:**
- Horizontal scrollable timeline
- Each month: Vertical bar chart with 3-color bands
- Month labels: Abbreviated (Jan, Feb, Mar)
- Bar height: Proportional to performance
- Color zones clearly separated with borders

**Color Band System (Traffic Light):**
- Green zone: Top 33% (excellent performance)
- Yellow/Amber zone: Middle 33% (moderate performance)
- Red zone: Bottom 33% (needs attention)
- Always labeled with thresholds

### Comparison View

**District Ranking Cards:**
- Current district: Highlighted card with border
- State average: Horizontal reference line across charts
- Top 3 districts: Green-tinted cards with trophy icons (1st, 2nd, 3rd)
- Bottom 3 districts: Red-tinted cards with alert icons
- Each card shows: District name, key metric, vs. state average percentage

**Comparison Charts:**
- Simple horizontal bar charts
- District bar always highlighted/thicker
- Length proportional to metric value
- Values shown at bar end

### Alerts & Notifications

**Alert Cards:**
- Distinct from regular cards with left border accent (4px thick)
- Icon at top: ExclamationTriangleIcon (wage delays), ArrowTrendingDownIcon (drops)
- Card types:
  - Critical (red border): Wage delays >30 days, completion drop >20%
  - Warning (yellow border): Employment drop >10%
  - Info (blue border): Data updated notifications
- Each alert shows: Icon, Alert type, Affected metric, Details, Date

**Alert Badge:**
- On bottom navigation Alerts tab
- Circular badge with count
- Position: top-right of icon

### Report Generation

**Print Preview Card:**
- A4 aspect ratio preview (portrait)
- Shows: District header, key metrics summary, trend snapshot, comparison summary
- Download/Print button: Large, full-width at bottom
- Icon: ArrowDownTrayIcon for download, PrinterIcon for print

### Language & Accessibility

**Language Toggle:**
- Pill-shaped toggle switch
- Shows "EN | मर" (English | Marathi)
- Position: Top-right of app bar
- Touch target: 48px height

**Bilingual Text Rendering:**
- Stacked layout (vertical)
- English text (first line): font-medium
- Marathi text (second line): font-normal, slightly smaller (0.9em)
- Line height: generous (leading-relaxed)

**Explainer Sections:**
- Expandable accordion pattern
- Icon: InformationCircleIcon
- Plain language definition in both languages
- Audio button integrated

### Offline Indicators

**Offline Banner:**
- Top-positioned, below app bar
- Amber background with info icon
- Text: "Showing cached data from [date]"
- Dismissible but reappears if still offline

**Data Freshness Indicator:**
- Small text below each metric card
- "Updated: [time ago]"
- Icon: ClockIcon (12px)

## Loading & Empty States

**Loading Skeleton:**
- Pulse animation on card backgrounds
- Preserves layout structure
- Shows placeholder shapes for numbers and text

**Empty State:**
- Large icon (96px): InboxIcon or ExclamationCircleIcon
- Heading: "No data available"
- Subtext: "Select a district to view performance"
- Optional action button

**Error State:**
- Red-tinted card with XCircleIcon
- Error message
- Retry button

## Interaction Patterns

**Touch Feedback:**
- All interactive elements: Scale on press (scale-95)
- Buttons: Ripple effect (Material-style)
- Cards: Subtle shadow elevation increase on tap

**Gestures:**
- Horizontal swipe: Navigate between months in trend view
- Pull-to-refresh: Update data (mobile native pattern)
- No complex multi-finger gestures

**Audio Playback:**
- Visual feedback: Pulsing animation on speaker icon
- Stop button appears when playing
- Text highlights as audio plays (karaoke-style)

## Performance Optimizations

**Image Strategy:**
- No hero images (data-focused utility app)
- All icons via Heroicons library (CDN)
- District maps: Optional, only if low-bandwidth SVGs available
- Avoid photos/imagery to reduce load time

**Animation Rules:**
- Minimal use: Only for loading states and audio feedback
- No scroll-triggered animations
- Transition durations: 150ms-200ms maximum
- Disable animations on low-end devices (prefers-reduced-motion)

## Responsive Breakpoints

- Mobile: 0-640px (primary focus)
- Tablet: 641px-1024px
- Desktop: 1025px+ (rare but supported)

**Adaptive Behaviors:**
- Bottom nav (mobile) → Side drawer (tablet+)
- 1-column grid (mobile) → 2-3 column (tablet+)
- Stacked comparison cards (mobile) → Side-by-side (tablet+)

## Accessibility Compliance

- WCAG AA contrast ratios minimum (4.5:1 for text)
- All interactive elements: Keyboard navigable
- Screen reader labels for all icons
- Skip navigation links
- Form inputs: Large labels, clear validation states
- Audio alternatives for all audio content (text transcripts)

This design creates a trustworthy, easy-to-use government service that prioritizes clarity and accessibility for rural citizens while maintaining visual appeal through strategic use of icons, color, and hierarchy.