/**
 * True while the page the visitor landed on was prerendered (scripts/prerender.mjs) and they haven't navigated yet.
 * Intro animations check it so content already painted from the HTML is never hidden and faded in again.
 */
let hydrating = false;

export const startHydration = (): void => {
  hydrating = true;
};
export const endHydration = (): void => {
  hydrating = false;
};
export const isHydrating = (): boolean => hydrating;
