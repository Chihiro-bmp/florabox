import { SEATED } from './catShapes';
import { SeatedCat } from './CatParts';

/** Static logo mark — the seated cat. `rim` adds a faint cream edge for dark backgrounds; an empty `title` makes it decorative. */
export default function CatMark({ height = 48, rim = false, title = 'Florabox', style }) {
  const [, , w, h] = SEATED.viewBox.split(' ').map(Number);
  return (
    <svg viewBox={SEATED.viewBox} height={height} width={(height * w) / h}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })} style={{ display: 'block', overflow: 'visible', ...style }}>
      <SeatedCat rim={rim} />
    </svg>
  );
}
