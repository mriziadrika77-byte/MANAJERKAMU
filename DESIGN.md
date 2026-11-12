# DESIGN SYSTEM & ART DIRECTION: MANAJERKAMU

## 1. Visual Character & Philosophy
- **Aesthetic**: Premium Minimalist SaaS with a personal-work management character.
- **Tone**: Trustworthy, Intelligent, Professional, Modern, Clean, Human-centered, Data-oriented.
- **Guiding Rule**: Clarity before decoration. Purposeful typography and whitespace over visual clutter and nested cards.

## 2. Color Palette & Design Tokens

### Light Mode
- **Brand Navy**: `#243B80` (Sidebar background, brand anchor, high-contrast badges)
- **Brand Blue**: `#4169E1` (Primary buttons, active states, key data highlights)
- **Blue Support**: `#3153B5` (Hover states, secondary emphasis)
- **Soft Lavender**: `#A8B8F0` (Chart lines, accents, subtle pill highlights)
- **Lavender Mist**: `#F2F3FC` (App body background, soft section panels)
- **Cloud White**: `#FFFFFF` (Card surfaces, clean white containers)
- **Deep Charcoal**: `#172033` (Primary readable typography)
- **Muted Slate**: `#778198` (Secondary metadata, captions, inactive icons)
- **Border**: `#E7EAF3` (Subtle dividers and card borders)

### Dark Mode
- **Background**: `#101728` (Deep navy canvas, strictly non-pure black)
- **Surface**: `#182238` (Primary card containers and modals)
- **Elevated Surface**: `#202C45` (Form inputs, popovers, secondary interactive tiles)
- **Primary Text**: `#F0F3FC` (Bright high-contrast readable headings and data)
- **Secondary Text**: `#A1ADC4` (Muted labels, helper texts)
- **Border**: `#2B3852` (Dark mode separators and structural borders)
- **Brand Blue (Dark)**: `#7895F0` (High visibility primary actions)
- **Soft Blue**: `#A8B8F0` (Chart accents, secondary highlights)
- **Brand Tint**: `#273657` (Active list item backgrounds)

### Semantic Palette (Status indicators only, never brand replacements)
- **Success**: `#16A477` / Dark: `#52C69C` (Background: `#E8F7F1` / `#183D37`)
- **Warning**: `#D99736` / Dark: `#E8B45F` (Background: `#FFF5E5` / `#43351F`)
- **Danger**: `#DC626F` / Dark: `#EF8992` (Background: `#FCEDEF` / `#482A36`)
- **Information**: `#6485C7` / Dark: `#8EABE8`

## 3. Typography & Hierarchy
- **Headings**: `Manrope` (weight: 600, 700, 800) with tight tracking (`-0.025em`).
- **Body & Numerical Data**: `Inter` (weight: 400, 500, 600) with optimized legibility.
- **Numbers/Currency**: Tabular figures where applicable to facilitate scanning in tables and cards.

## 4. Components & Elevation
- **Cards**: `rounded-card` (14px), subtle border (`#E7EAF3` / `#2B3852`), and restrained shadow. No nested cards.
- **Buttons**: Explicit hierarchy (Primary, Secondary, Outline, Ghost, Danger) with distinct hover, focus-visible, and active tactile feel.
- **Tables**: Clear column alignment, currency right-aligned, semantic status badges with text cues.

## 5. Anti-Patterns to Strictly Eliminate
1. No purple-to-blue decorative gradients.
2. No equal-weight KPI cards (Net Income must stand out as the primary outcome).
3. No nested card-in-card visual containers.
4. No decorative charts without real data context.
5. No emoji icons as UI controls.
6. No excessive badges or pills on one line.

