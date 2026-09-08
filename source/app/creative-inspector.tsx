'use client';

import { useEffect, useState } from 'react';

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  selected?: boolean;
};
type Inspection = {
  bands: Box[];
  outline?: Box;
  name: string;
  padding: number[];
};
const selector =
  '#main, .portrait-side, .intro-copy, .section-heading, #main > .section, .selection, .book-shelf, .colophon';
const round = (value: number) => Math.round(value * 10) / 10;

export default function CreativeInspector({ enabled }: { enabled: boolean }) {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const targets = [...document.querySelectorAll<HTMLElement>(selector)];
    let selected = document.querySelector<HTMLElement>('#main');
    let frame = 0;
    const draw = () => {
      frame = 0;
      const bands: Box[] = [];
      let outline: Box | undefined;
      let name = 'Page';
      let padding = [0, 0, 0, 0];
      for (const target of targets) {
        const rect = target.getBoundingClientRect();
        if (!rect.width || rect.bottom < 0 || rect.top > innerHeight) continue;
        const style = getComputedStyle(target);
        const values = [
          style.paddingTop,
          style.paddingRight,
          style.paddingBottom,
          style.paddingLeft,
        ].map((v) => parseFloat(v) || 0);
        const [top, right, bottom, left] = values;
        const x = rect.x + (parseFloat(style.borderLeftWidth) || 0);
        const y = rect.y + (parseFloat(style.borderTopWidth) || 0);
        const width =
          rect.width -
          (parseFloat(style.borderLeftWidth) || 0) -
          (parseFloat(style.borderRightWidth) || 0);
        const height =
          rect.height -
          (parseFloat(style.borderTopWidth) || 0) -
          (parseFloat(style.borderBottomWidth) || 0);
        bands.push(
          { x, y, width, height: top },
          { x, y: y + height - bottom, width, height: bottom },
          { x, y: y + top, width: left, height: height - top - bottom },
          {
            x: x + width - right,
            y: y + top,
            width: right,
            height: height - top - bottom,
          },
        );
        if (target === selected) {
          outline = { x, y, width, height };
          padding = values.map(round);
          name =
            target.dataset.inspectLabel ||
            target.getAttribute('aria-label') ||
            target.querySelector('h2')?.textContent ||
            (target.id === 'main'
              ? 'Page'
              : target.matches('.selection')
                ? target.textContent?.trim()
                : '') ||
            'Section';
        }
      }
      setInspection({
        bands: bands.filter((b) => b.width > 0 && b.height > 0),
        outline,
        name,
        padding,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const select = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>(selector);
      if (target && target !== selected) {
        selected = target;
        schedule();
      }
    };
    document.addEventListener('pointerover', select);
    document.addEventListener('focusin', select);
    document.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    document.fonts.addEventListener('loadingdone', schedule);
    const observer = new ResizeObserver(schedule);
    targets.forEach((target) => observer.observe(target));
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('pointerover', select);
      document.removeEventListener('focusin', select);
      document.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      document.fonts.removeEventListener('loadingdone', schedule);
    };
  }, [enabled]);
  if (!enabled || !inspection) return null;
  return (
    <div className="padding-inspector" aria-hidden="true">
      <svg width="100%" height="100%">
        {inspection.bands.map((box, i) => (
          <rect key={i} {...box} className="padding-band" />
        ))}
        {inspection.outline && (
          <rect {...inspection.outline} className="padding-selected" />
        )}
      </svg>
      {inspection.outline && (
        <div className="padding-readout">
          <b>{inspection.name}</b>
          <span>
            {inspection.padding
              .map((v, i) => `${['Top', 'Right', 'Bottom', 'Left'][i]} ${v}px`)
              .join(' · ')}
          </span>
          <small>Padding · hover or focus to inspect</small>
        </div>
      )}
    </div>
  );
}
