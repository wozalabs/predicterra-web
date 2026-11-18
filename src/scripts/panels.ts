/**
 * Panel entrance: in a `.pnl` pair, the section that comes first holds still
 * and the one after it slides up over it like a new panel (the home's Across
 * over the 3D stage, for any two sections). The first section is pinned once
 * its bottom reaches the bottom of the screen (top: viewport height minus its
 * own height, or 0 if it is shorter), so all of it has been read before the
 * panel covers it. The pin ends with the pair.
 */
export function mountPanels() {
  const pairs = Array.from(document.querySelectorAll<HTMLElement>('.pnl'));
  if (!pairs.length) return;
  const items = pairs
    .map((pair) => ({ pin: pair.firstElementChild as HTMLElement | null, panel: pair.lastElementChild as HTMLElement | null }))
    .filter((p): p is { pin: HTMLElement; panel: HTMLElement } => !!p.pin && !!p.panel && p.pin !== p.panel);

  const place = () => {
    const vh = window.innerHeight;
    for (const { pin, panel } of items) {
      pin.style.position = 'sticky';
      pin.style.top = `${Math.min(0, vh - pin.offsetHeight)}px`;
      pin.style.zIndex = '0';
      panel.style.position = 'relative';
      panel.style.zIndex = '1';
    }
  };

  // Keyboard: a focused link or button in a pinned section must not sit under
  // the panel sliding over it. Scroll back until the panel's top is below it.
  for (const { pin, panel } of items) {
    pin.addEventListener('focusin', (e) => {
      requestAnimationFrame(() => {
        const el = e.target as HTMLElement;
        const r = el.getBoundingClientRect();
        const cover = panel.getBoundingClientRect().top;
        if (cover >= r.bottom + 16) return;
        window.scrollBy({ top: cover - r.bottom - 16 - window.innerHeight * 0.15, behavior: 'auto' });
      });
    });
  }

  const ro = new ResizeObserver(place);
  items.forEach(({ pin }) => ro.observe(pin));
  window.addEventListener('resize', place, { passive: true });
  place();
}
