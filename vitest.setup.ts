import "@testing-library/jest-dom/vitest";

/**
 * jsdom ships no CSS media-query engine, so `window.matchMedia` is undefined.
 * GSAP calls it the moment ScrollTrigger is registered (see `src/lib/gsap.ts`),
 * which means *any* component importing a motion primitive throws at import
 * time without this shim.
 *
 * Every query reports `matches: false`, so `gsap.matchMedia()` branches never
 * run under test and components are asserted in their plain, final,
 * server-rendered state — which is exactly the contract the specs check.
 */
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
