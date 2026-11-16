# TELERING Design System — High-Taste Frontend Edition
*Guided by Anthropic Frontend Design & Taste-Skill 2.5 (Anti-Slop Architecture)*

---

## 1. Design Thesis & Subject Matter
- **Client/Product**: TELERING Smartphone Retail & Live-Streaming Cheat Sheet.
- **Audience**: Live stream hosts (TikTok, Shopee, Tokopedia), sales consultants, and prospective smartphone buyers in Indonesia.
- **Primary Goal**: Instant readability, authentic retail credibility, high speed spec lookup during fast-paced live broadcasts, and seamless real-time cloud catalog sync.
- **Aesthetic Benchmark**: x.ai & figma.com — restrained, purposeful, razor-sharp hairline borders, one section per screen rhythm, pure contrast, zero AI-template clichés.

---

## 2. Core Tokens & Palette

| Token | Hex / Value | Purpose |
|---|---|---|
| `--bg-ground` | `#090A0D` | Obsidian base ground, neutral dark without muddy tint |
| `--surface-card` | `#121418` | Exactly 1 step off ground for cards and containers |
| `--surface-hover` | `#181B21` | Active card / row hover surface |
| `--border-hairline`| `#1E232B` | 1px border at 10-12% opacity |
| `--border-highlight`| `#2C333E` | 1px focused / selected border |
| `--ink-primary` | `#F3F4F6` | 95% opacity high-contrast text |
| `--ink-secondary` | `#9CA3AF` | 65% opacity clean metadata |
| `--ink-muted` | `#6B7280` | Subtle structural labels & hints |
| `--accent-telering`| `#FF3823` | Signature TELERING red-vermilion, used with surgical restraint |
| `--accent-emerald` | `#10B981` | Realtime sync pulse & promo badge |

---

## 3. Typographic System
- **UI & Headings**: *Plus Jakarta Sans* / *Inter* (Weights: 500 Medium, 600 SemiBold, 700 Bold, 800 ExtraBold).
- **Prices & Currency**: High-contrast, tabular format (`Rp 2.499.000`) without decorative glow.
- **Anti-Slop Typography Rules**:
  - No random all-caps tracking on body elements.
  - No accenting single words with gradient text.
  - Sentence case for user actions ("Buka spesifikasi", "Salin deskripsi", "Bandingkan HP").

---

## 4. Components & Layout Specs
- **Cards**:
  - Padding: 24px (phone) to 28px (desktop).
  - Radii: 16px (card), 10px (inner elements). Nested radius rule: `r_inner = r_card - padding_margin`.
  - Micro-motion: 2px lift on hover (`transform: translateY(-2px)`), no fake 3D tilts or carousels.
  - Two levels, never three: card > panel/content.
- **Live Host Matrix (Table View)**:
  - High density, 100% visible data lines for broadcast hosts under pressure.
  - One-click copy for live streaming caption.
- **Side-by-Side Comparison**:
  - Floating dock when 2-3 items are selected.
  - Direct spec diff matrix (Chipset, Battery, Camera, Screen, Price).
