# WCAG 2.1 AA Mapping Matrix

| Criterion | Target component | Implementation | Verification |
|---|---|---|---|
| **1.3.1 Info and Relationships (A)** | All pages | Landmarks (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`); one `h1` per page with ordered headings; `fieldset` and `legend` for filter groups | Open the landmark list in NVDA (D key) and the headings list (H key); run axe |
| **1.4.3 Contrast (Minimum) (AA)** | All text | Greyscale palette with computed ratios in `main.css` (body text 17.40:1, hint text 8.45:1) | Check against the CSS comments with WebAIM Contrast Checker; run Lighthouse |
| **1.4.11 Non-text Contrast (AA)** | Input borders, buttons, focus ring | `#767676` borders (4.54:1 on white); black focus ring (21:1 on white) | Colour picker plus contrast checker |
| **2.1.1 Keyboard (A)** | Nav, search, filters, form, buttons | Native `a`, `input`, `select` and `button` elements only, with no click-only `div`s | Put the mouse aside and Tab through every page; Enter and Space activate controls |
| **2.4.1 Bypass Blocks (A)** | Every page | "Skip to main content" link that appears on focus and jumps to `#main` | Press Tab once on page load and check the link appears and works |
| **2.4.2 Page Titled (A)** | Every page | Unique, descriptive `<title>` per page | Read browser tab titles; check each page differs |
| **2.4.7 Focus Visible (AA)** | Every interactive element | `:focus-visible` with a 3px outline and 2px offset; default never removed | Tab through each page at 100% and 200% zoom |
| **3.3.2 Labels or Instructions (A)** | Search box, booking form | Visible `<label for>` on every input; helper text linked via `aria-describedby` | Check with NVDA that the label and hint are read when each field gets focus |
| **1.4.10 Reflow (AA)** | All pages | Relative units, flex-wrap, single-column nav at 40rem | Zoom to 400% (or a 320px-wide window) and check for no sideways scrolling |
| **3.3.1 Error Identification (A)** | Booking form | `aria-invalid` plus error text linked with `aria-describedby` | Submit an empty form with NVDA and check the errors are read aloud |
| **4.1.3 Status Messages (AA)** | Result count, form status | `aria-live="polite"` region updated after filtering or submitting | Listen with NVDA for the announcement without moving focus |