# Riverside Public Library: Adaptive Learning & Resource Portal

Prototype for ticket MD-2026-0143 (Marlowe Digital). Built to be fully usable by keyboard and screen reader.

- **Live site:** deployed URL
- **Wireframes (Part A):** `/wireframes` (3 static pages, `main.css`, `persona.md`, `wcag-matrix.md`)
- **App (Part B):** repository root (React + Vite)

## Run it

```powershell
npm install
npm run dev          # development
npm test -- --run    # component tests (Vitest, Testing Library, vitest-axe)
npm run lint         # ESLint with jsx-a11y
npm run build && npm run preview
```

---

## Part C: Architectural and accessibility decisions

### 1. Accessibility trade-offs

**Native `<dialog>` instead of a custom modal.** The booking review step uses `<dialog>` with `showModal()`. The browser traps focus, makes the page behind it inert and closes on Esc, so there is far less code to get wrong than a hand-built focus trap. The cost is less control over behaviour and styling. I handle the `cancel` event so React state stays in charge, and focus returns to the "Reserve room" button on close.

**Native date and time inputs instead of custom pickers.** Native controls give users a built-in picker and familiar behaviour, but Chrome exposes them as separate spin buttons (year, month, day, hours, minutes), so the date field takes four Tab stops and the time field three. I accepted that cost because a custom picker is a much larger source of accessibility bugs. Validation (future date, 09:00 to 17:00 start) is done in my own code with `noValidate`, so messages and focus are consistent.

**Live-region strategy: loud for blocking errors, quiet for the rest.** On a failed submit, an `aria-live="assertive"` region announces a count and the first problem, and focus moves to that field. Per-field errors are not live. They are read when the field gets focus through `aria-describedby`, which keeps blur validation from becoming noisy. The search result count uses `role="status"` (polite), which updates on every keystroke. Testing showed this is chatty: typing "comp" produced three announcements ("5", "3", then "1 course found"). I kept the instant feedback and document the verbosity here; a debounce would be the next improvement.

### 2. Assistive tech state architecture

State lives in React hooks inside each component and is rendered straight into accessibility attributes, so the DOM and the accessibility tree cannot drift apart. `useState` booleans drive `aria-expanded` (the Filters accordion) and `aria-pressed` (topic and format toggles). A single `errors` object drives `aria-invalid`, the error text, and the `aria-describedby` chain that links each input to its hint and error. The `status` string renders inside an always-mounted `aria-live` container, because regions added to the page at the same moment as their text are often not announced. Focus is moved imperatively, only after state changes: a `useRef` and `useEffect` in `App` focus the new page `h1` (`tabIndex={-1}`) on view changes, and the booking form focuses the first invalid field or the "Booking confirmed" heading. `document.title` updates with each view.

### 3. Verification and testing audit

**Automated.** TODO Final Lighthouse accessibility scores after the restyle: Home __ / Courses __ / Book a room __ (reports in `/docs`). An earlier run before the restyle scored 100 on all three views. Component tests: 13 passing across 3 files, including an axe scan of the App, the course directory and the booking form with no violations. Note that axe in jsdom cannot measure colour contrast, so contrast evidence is the computed ratios in `src/index.css` plus Lighthouse.

**Manual screen reader testing.** TODO NVDA version __, Chrome version __, Windows 11. Findings from the logged sessions:

| Area | What NVDA announced | Result |
|---|---|---|
| Skip link and landmarks | "Skip to main content, link"; banner, navigation, main | Pass |
| View change | New page heading read (focus moved); current page announced on the nav button | Pass |
| Search | Count announced per keystroke ("5", "3", "1 course found") | Pass, verbose |
| Filters | "collapsed" then "expanded"; toggles "not pressed" then "pressed" | Pass |
| Failed submit | "Error: 2 problems found..." then focus on first invalid field with "invalid entry" and its error | Pass |
| Review dialog | Announced as "Review your booking, dialog" with the booking details; Tab moved between its two buttons | Pass |
| Confirmation | "Booking confirmed, heading level 2"; "Make another booking" returned focus to Full name | Pass |
| Esc closes dialog | TODO result | TODO |

**Defects found by manual testing.**
1. A topic typed as "Digital Skills" created a duplicate filter button and excluded one course from "Digital skills". Fixed in `courses.js`. TODO re-test result after rebuild.
2. The empty Date field's error was not spoken on one Tab pass, but was on others. Treated as inconsistent behaviour of Chrome's native date control. The error text is in the page and the submit summary still names the first problem.
3. The pressed-state tick (CSS `::before`) is read aloud as part of the button name. Minor and redundant. TODO note whether the fix was applied.

**Keyboard-only (NVDA off).** Booking form Tab order matched visual order: Full name, Email, Room, Date (Year, Month, Day, picker), Start time (Hours, Minutes, picker), Number of people, Reserve room. No keyboard traps were found. TODO add Tab order for Home and Courses.

**Tool note.** ESLint is pinned to v9 because `eslint-plugin-jsx-a11y` did not support v10 at install time.