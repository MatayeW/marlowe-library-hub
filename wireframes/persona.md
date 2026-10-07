# Primary Persona: Remi Jacobs, 19

**Role:** Second-year university student who studies at the public library most days
**Access need:** Low vision. Relies on screen magnification and high contrast, and uses a screen reader to read long text.

## Assistive technology configuration

| Item | Detail |
|---|---|
| Computer / OS | Windows 11 |
| Browser | Firefox, with page zoom usually set to 300% |
| Magnifier | Windows Magnifier at 300%, high contrast theme on |
| Screen reader | NVDA at about 60% speech rate, used mainly for reading long text and forms |
| Phone | iPhone with VoiceOver and Larger Text turned on |

## Input modality

- **Primary input:** Keyboard-first. Uses the mouse only for short moves, because the pointer is hard to track on a magnified screen.
- **How they navigate a page:** Jumps by landmarks, headings and form fields. Relies on Tab order to find where they are.
- **Display settings:** Needs content to reflow into a single column when zoomed, with no sideways scrolling.

## Pain points with conventional web design

1. Unlabelled buttons are announced only as "button", so Remi cannot tell what they do.
2. Errors are shown in red text but never announced, and the colour alone is hard to see in high contrast.
3. Popups trap keyboard focus, and there is no way to get back to the page.
4. Filters update results without telling Remi, so they do not know anything changed.
5. Missing focus indicators leave Remi unable to tell where they are on a magnified page.

## Goals on the library website

1. Remi wants to find a course through the catalogue without asking staff for help.
2. Remi wants to book a study room independently, including picking a date and time.
3. Remi wants to register for a workshop and get clear confirmation that it worked.
4. Remi wants to filter the digital learning archive to find study material for an upcoming exam.

## Design implications

| Pain point | What the prototype will do |
|---|---|
| Unlabelled buttons | Every control has a visible label or an accessible name |
| Errors not announced | `aria-live` region plus error text linked with `aria-describedby` and `aria-invalid` |
| Popups trap focus | Modal moves focus in on open, supports Escape, and returns focus to the trigger on close |
| Filters change silently | Result count is announced after each filter change |
| Missing focus indicators | 3px high-contrast `:focus-visible` ring on every interactive element |