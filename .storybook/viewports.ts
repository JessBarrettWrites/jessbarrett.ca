import type { Args, Decorator } from '@storybook/vue3-vite'
import { useElementSize, useEventListener } from '@vueuse/core'
import { MINIMAL_VIEWPORTS } from 'storybook/viewport'
import { computed, ref, toRaw, watch } from 'vue'

// DEV NOTE: Tailwind's breakpoints follow the window, not the element, so a component only gets
//           its mobile (or tablet) layout in a window that size. These stories show themselves in
//           one frame per viewport, side by side, scaled down together to fit the pane (never up).
//           Each frame loads the same story with FRAME_PARAM in its URL, which renders the component
//           itself. The frames take the toolbar's theme as they load, and follow edits in the
//           Controls panel (see `followArgs`). Storybook's own viewport menu is turned off
//           (.storybook/main.ts) in favour of these.

const FRAME_PARAM = 'viewport-frame'
// Messages between the story and its frames: a frame asks for the args once it's ready, and the
// story sends them then and after every edit
const READY_MESSAGE = 'viewport-frame-ready'
const ARGS_MESSAGE = 'viewport-args'
const GAP = 24 // px, between frames and around them

// Each frame's label, as a yellow sticky note: dark text on soft yellow, a thin darker-yellow edge
// and a small shadow below and to the right. Fixed colours, since the canvas behind is a light
// checkerboard in either theme. The name, height and width are on lines of their own, so the label
// fits over its (scaled-down) frame rather than widening the row.
const LABEL_STYLE = {
  display: 'inline-block',
  maxWidth: '100%',
  boxSizing: 'border-box',
  marginBottom: '0.5rem',
  padding: '3px 9px',
  font: '400 0.8rem/1.5 system-ui',
  overflowWrap: 'anywhere',
  color: '#2b2b2b',
  background: '#fff38a',
  border: '1px solid #e2cf4a',
  borderRadius: '2px',
  boxShadow: '2px 3px 6px rgb(0 0 0 / 0.18)',
}

// Device names for the labels, in place of Storybook's own (`Small mobile`, `Large mobile`)
const DEVICE_NAMES: Record<string, string> = {
  mobile1: 'Mobile (Small)',
  mobile2: 'Mobile (Large)',
}

// The label's device name, a little larger than its size lines
const NAME_STYLE = { display: 'block', fontSize: '0.9rem', fontWeight: 700 }
// A size line (height or width), and its emphasised "H:" or "W:"
const SIZE_STYLE = { display: 'block' }
const KEY_STYLE = { fontWeight: 700 }

function inFrame(): boolean {
  return new URLSearchParams(window.location.search).has(FRAME_PARAM)
}

let following = false

/** A plain copy of a story's args (which are reactive), to post to a frame. Keeps Dates, unlike a
 *  JSON round trip: a frame given an event's `start` as a string fails rendering it. */
function plain(value: unknown): unknown {
  const raw = toRaw(value)
  if (raw instanceof Date) return new Date(raw)
  if (Array.isArray(raw)) return raw.map(plain)
  if (raw && typeof raw === 'object') {
    return Object.fromEntries(Object.entries(raw).map(([key, v]) => [key, plain(v)]))
  }
  return raw
}

/** In a frame: take the story's args from the story showing the frames, as they're edited */
function followArgs(storyId: string) {
  if (following) return
  following = true
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.type !== ARGS_MESSAGE) return
    // DEV NOTE: The same call Storybook makes for an edit in the Controls panel; it's internal, so
    //           check it still exists after upgrading Storybook
    const preview = (window as any).__STORYBOOK_PREVIEW__
    preview?.onUpdateArgs({ storyId, updatedArgs: event.data.args })
  })
  window.parent.postMessage({ type: READY_MESSAGE }, window.location.origin)
}

/**
 * Decorator showing the story at every viewport size, side by side. Use with `layout: 'fullscreen'`.
 * A story can show some of them only, with `parameters: { frames: ['desktop'] }` (keys of
 * MINIMAL_VIEWPORTS: `mobile1`, `mobile2`, `tablet`, `desktop`), or none, with `frames: false`: the
 * story itself, filling the pane and following its width as it's resized.
 */
export const viewports: Decorator = (story, context) => {
  if (context.parameters.frames === false) return story()

  if (inFrame()) {
    // The site's page background in place of the canvas's checkerboard (preview.css)
    document.documentElement.classList.add('viewport-frame')
    followArgs(context.id)
    return story()
  }

  // The story's args, as plain data to send to the frames (Storybook's args are reactive)
  const args = context.args as Args
  const message = () => ({ type: ARGS_MESSAGE, args: plain(args) })

  const globals = encodeURIComponent(`theme:${context.globals.theme}`)
  const only: string[] | undefined = context.parameters.frames
  const shown = Object.entries(MINIMAL_VIEWPORTS).filter(([key]) => !only || only.includes(key))
  const frames = shown.map(([key, { name, styles }]) => ({
    name: DEVICE_NAMES[key] ?? name,
    // The device's size, as shown on its label
    heightLabel: styles.height,
    widthLabel: styles.width,
    width: parseFloat(styles.width),
    height: parseFloat(styles.height),
    src: `iframe.html?id=${context.id}&viewMode=story&globals=${globals}&${FRAME_PARAM}`,
  }))
  const naturalWidth = frames.reduce((sum, f) => sum + f.width, 0) + GAP * (frames.length + 1)

  return {
    setup() {
      const pane = ref<HTMLElement>()
      const { width: paneWidth } = useElementSize(pane)
      const scale = computed(() =>
        paneWidth.value ? Math.min(1, paneWidth.value / naturalWidth) : 1,
      )

      // Send the args to each frame when it's ready, and to all of them after each edit
      const iframes = ref<HTMLIFrameElement[]>([])
      useEventListener(window, 'message', (event: MessageEvent) => {
        if (event.origin !== window.location.origin || event.data?.type !== READY_MESSAGE) return
        // DEV NOTE: Only this story's own frames: a Docs page shows several stories' frames at once,
        //           and every story would otherwise answer every frame (the last answer winning)
        const frame = iframes.value.find((iframe) => iframe.contentWindow === event.source)
        frame?.contentWindow?.postMessage(message(), window.location.origin)
      })
      watch(
        () => JSON.stringify(args),
        () => {
          for (const iframe of iframes.value) {
            iframe.contentWindow?.postMessage(message(), window.location.origin)
          }
        },
      )

      return { frames, pane, scale, iframes, GAP, LABEL_STYLE, NAME_STYLE, SIZE_STYLE, KEY_STYLE }
    },
    template: `
      <div ref="pane" style="width: 100%">
        <div :style="{ display: 'flex', gap: GAP * scale + 'px', padding: GAP * scale + 'px', alignItems: 'flex-start' }">
          <figure v-for="frame in frames" :key="frame.name" :style="{ margin: 0, width: frame.width * scale + 'px' }">
            <figcaption :style="LABEL_STYLE">
              <span :style="NAME_STYLE">{{ frame.name }}</span>
              <span :style="SIZE_STYLE"><span :style="KEY_STYLE">H:</span> {{ frame.heightLabel }}</span>
              <span :style="SIZE_STYLE"><span :style="KEY_STYLE">W:</span> {{ frame.widthLabel }}</span>
            </figcaption>
            <div :style="{ width: frame.width * scale + 'px', height: frame.height * scale + 'px', outline: '1px solid rgb(128 128 128 / 0.4)' }">
              <iframe
                ref="iframes"
                :src="frame.src"
                :title="frame.name"
                loading="lazy"
                :style="{ width: frame.width + 'px', height: frame.height + 'px', border: 0, transform: 'scale(' + scale + ')', transformOrigin: 'top left' }"
              />
            </div>
          </figure>
        </div>
      </div>`,
  }
}
