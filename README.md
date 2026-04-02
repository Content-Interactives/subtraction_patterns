# Subtraction Patterns

React (JSX) app: four stacked equations **`x - y = z`** share a fixed step pattern (**`xChange`**, **`yChange`**: nonzero integers from roughly **-3…3**). One row is hidden and replaced by **stepper inputs** (1–20) for minuend, subtrahend, and difference; **Check!** compares the stringified equation to the removed line. Correct answers trigger **canvas-confetti** and a new puzzle after 4 seconds.

**Live site:** [https://content-interactives.github.io/subtraction_patterns](https://content-interactives.github.io/subtraction_patterns)

Standards and curriculum notes: [Standards.md](Standards.md).

---

## Stack

| Layer | Notes |
|--------|--------|
| Build | Vite 7, `@vitejs/plugin-react` |
| UI | React 19 (`.jsx` sources—**not** TypeScript) |
| Styling | Tailwind CSS 3, `SubtractionPatterns.css` (e.g. shake), `App.css` |
| Effects | `canvas-confetti` |
| Lint | ESLint 9 |
| Deploy | `gh-pages -d dist`; `predeploy` runs `vite build` |

---

## Repository layout

```
vite.config.js          # base: '/subtraction_patterns/'
tailwind.config.js, postcss.config.js, eslint.config.js
index.html
src/
  main.jsx              # createRoot → <App />
  App.jsx               # Mounts <SubtractionPatterns />
  components/
    SubtractionPatterns.jsx   # Game logic + UI
    SubtractionPatterns.css
    ui/reused-ui/       # Container, GlowButton, FlexiText, Input, NavButtons, MultiGlowButton
    ui/reused-animations/     # fade, scale, glow (imported by shared components if used)
```

---

## Logic (`SubtractionPatterns.jsx`)

### `generateEquations` (runs on mount and after each success)

1. Pick **`xChange`** and **`yChange`**: `Math.floor(Math.random() * 6) - 3` with **0 remapped** to ±1 so steps are never zero.
2. Compute **`minInitialY`** so after three further steps **`y`** stays ≥ 1.
3. Sample starting **`x`** in **[8, 15]** and **`y`** with lower bound **`max(minInitialY, 2)`**, then **simulate four rows**; require **`x`, `y`, `z = x - y`** all in **[1, 20]** (retry up to 100 attempts).
4. Build **four** display strings `` `${x} - ${y} = ${z}` `` updating **`x += xChange`**, **`y += yChange`** each row.
5. Choose random **`inputPosition`** ∈ {0,…,3}; store that line in **`removedEquation`**; expose the other three as static text.

### `checkAnswer`

- Builds **`${inputX} - ${inputY} = ${inputAnswer}`** (must match **`removedEquation`** exactly, including spacing).
- On match: **`confetti(...)`**, **`showAnswer`**, then **`setTimeout(..., 4000)`** → **`generateEquations()`** (inputs are **not** explicitly reset to the new defaults—defaults remain initial `useState(1)` unless you add a reset in `generateEquations`).
- On mismatch: **`button-shake`** class for 500 ms.

### UI

- **Container** from `reused-ui`: orange title bar (`borderColor="#FF7B00"`), **`showSoundButton={true}`** but **no `onSound`** prop—icon renders with a no-op click.
- **Reset** is off (`showResetButton={false}`); no way to skip a stuck round without refresh unless you add reset.

---

## `vite.config.js`

**`base: '/subtraction_patterns/'`** must match the GitHub Pages project path (underscore). Change both if the repo slug differs.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Vite dev server |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + publish `dist` via gh-pages |

---

## Embedding

- Outer **Container** targets **~500px** height and **max-width ~424px** (see `Container.jsx`).
- No LMS / `postMessage` contract.

---

## Maintenance

- After **`generateEquations`**, consider **`setInputX` / `setInputY` / `setInputAnswer`** to known defaults so the next puzzle does not reuse stale stepper values.
- Wire **`onSound`** or hide **`showSoundButton`** until audio exists.
- **`messages`** pool is unused for wrong answers; only success picks a random string.
