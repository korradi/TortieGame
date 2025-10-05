export const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
