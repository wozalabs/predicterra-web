/**
 * Page titles (components/PageTitle.astro): every word takes the entrance delay
 * of the line it sits on, so the title comes in line by line like the home hero.
 */
const FIRST = 200; // ms, the hero's first line
const STEP = 90; // ms between lines

export function mountTitleLines() {
  document.querySelectorAll<HTMLElement>('[data-title-lines]').forEach((title) => {
    const words = Array.from(title.querySelectorAll<HTMLElement>('.ttl__w'));
    let line = -1;
    let top = -Infinity;
    for (const w of words) {
      if (w.offsetTop > top + 2) {
        line++;
        top = w.offsetTop;
      }
      w.style.setProperty('--d', `${FIRST + line * STEP}ms`);
    }
  });
}
