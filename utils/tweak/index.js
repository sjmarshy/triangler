import { lighten, darken } from 'polished';

export default function tweak(color) {
    const r = Math.random();
    if (r > 0.5 && r <= 0.74) {
        return lighten(0.05, color);
    } else if (r >= 0.75) {
        return darken(0.05, color);
    }
    return color;
}
