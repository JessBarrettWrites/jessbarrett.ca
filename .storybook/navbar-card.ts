import type { Decorator } from '@storybook/vue3-vite'

// DEV NOTE: Shows a header control (the language menu, the theme toggle) on a small card styled like
//           a slice of the site's header (src/components/Nav.vue): its teal, with orange text. The
//           card wraps the control with the same space on every side. Inline styles, in the theme's
//           colours, since Tailwind may not scan this folder.

const PADDING = '12px'

interface Room {
  /** Space below the card, e.g. for a dropdown */
  below?: string
  /** Space left of the card, e.g. for a dropdown that opens to the left */
  left?: string
}

/** Decorator placing the story on a header-like card, at the left of the canvas */
export function navbarCard({ below = '0px', left = '0px' }: Room = {}): Decorator {
  return () => ({
    template: `
      <div :style="{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '32px 16px',
        paddingBottom: 'calc(32px + ${below})',
        paddingLeft: 'calc(16px + ${left})',
      }">
        <div :style="{
          display: 'flex',
          alignItems: 'center',
          padding: '${PADDING}',
          background: 'var(--color-neutral)',
          color: 'var(--color-neutral-content)',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgb(8 30 36 / 0.2)',
        }">
          <story />
        </div>
      </div>`,
  })
}
