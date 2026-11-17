import type { RouteLocationNormalized } from 'vue-router'

// DEV NOTE: App.vue fades the old page out before fading the new one in, so scrolling (main.ts)
//           waits for the new page, or the old one would jump to the top as it fades. Waits half
//           a second at most, in case no fade happens (reduced motion still runs the hooks).

let entering: (() => void) | undefined

/** Called by App.vue as the new page is put in */
export function pageEntering() {
  entering?.()
  entering = undefined
}

/** Resolves once the new page is in, when moving between pages (not on the first page or a #hash) */
export function nextPage(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
): Promise<void> {
  if (!from.matched.length || to.path === from.path) return Promise.resolve()
  return new Promise((resolve) => {
    entering = resolve
    setTimeout(resolve, 500)
  })
}
