# F.L.A.M.E.S.

A single-page web app of the classic Filipino childhood paper-and-pencil fortune-telling game that predicts romantic compatibility. Type your name, type your crush's name, and let FLAMES decide your fate.

**F** — Friends · **L** — Lovers · **A** — Anger · **M** — Marriage · **E** — Enemies · **S** — Sweethearts

🔗 **[Play it live](https://neil.onl/flames)**

## How It Works

1. **Enter your name** — big serif input, press Enter or tap Next
2. **Enter your crush's name** — same deal
3. **Letter crossing** — matching letters get crossed out with a staggered animation, remaining count is revealed
4. **FLAMES countdown** — a pointer hops through F-L-A-M-E-S, eliminating letters one by one based on the remaining count
5. **Result reveal** — card-style reveal with emoji, meaning, and your names. Save or share the result as an image

## Tech Stack

- Vanilla JS (no framework)
- Vite for bundling
- GitHub Pages for deployment
- Google Fonts (Playfair Display + Inter)

## Architecture

```
flames/
  index.html                         # entry point, SEO meta tags, fonts
  vite.config.js                     # GitHub Pages base path
  src/
    main.js                          # step manager wiring + imports
    style.css                        # CSS variables, reset, base layout
    lib/
      step-manager.js                # state machine for step transitions
      flames-algorithm.js            # pure game logic (no DOM)
    steps/
      name-input.js / .css           # step 1 & 2: name entry
      letter-crossing.js / .css      # step 3: cross out matching letters
      flames-countdown.js / .css     # step 4: pointer eliminates FLAMES letters
      result-reveal.js / .css        # step 5: card result + save/share + play again
  public/
    favicon.svg                      # rose "F" favicon
    og-image.svg                     # social media preview card
  .github/
    workflows/deploy.yml             # GitHub Pages CI/CD
```

### Step Module Contract

Every step exports a function with this signature:

```js
export function createStepName(container, context, onComplete) {
  // container: DOM element to render into
  // context: shared object { name1, name2, result, meaning, ... }
  // onComplete: call with optional updates, e.g. onComplete({ name1: 'Neil' })
}
```

### FLAMES Algorithm

1. Normalize both names to lowercase alpha characters
2. For each letter in name1, find the first unmatched match in name2 — mark both as matched
3. Count remaining (unmatched) letters from both names
4. Starting with `[F, L, A, M, E, S]`, count to `n` and eliminate that letter, continuing from the next position
5. Last letter standing is the result

## Design

- **Color palette**: Dusty rose, lavender, terracotta, sage, gold, mauve on warm cream
- **Typography**: Playfair Display (serif, headlines) + Inter (sans, body)
- **Animations**: CSS transitions for crossing/elimination, opacity fades between steps, spring scale on result card
- **Responsive**: `clamp()` typography, flexbox layout, mobile-first

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # production build to dist/
npm run preview   # preview production build
```

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.
