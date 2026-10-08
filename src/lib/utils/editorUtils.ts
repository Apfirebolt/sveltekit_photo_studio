export const debounce = (fn: (...args: any[]) => void, wait = 100) => {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
