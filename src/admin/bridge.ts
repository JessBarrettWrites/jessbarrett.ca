import { createApp, h, ref, shallowRef } from 'vue'
import type { Component, Ref, ShallowRef } from 'vue'
import { createMemoryHistory, createRouter, START_LOCATION } from 'vue-router'

import { DARK_THEME, LIGHT_THEME } from '@/constants'
import { DEFAULT_LOCALE, isLocale, LOCALE_KEY, type Locale } from '@/locale'
import { MESSAGES_KEY, type Messages } from '@/messages'
import type { PreviewTemplate, PreviewTemplateProps } from '@/admin/sveltia'

// DEV NOTE: Sveltia renders preview templates with its bundled React, so each template is a thin React
//           component that mounts a Vue app into its own <div> inside the preview iframe, then hands
//           that app fresh props on every edit. The site's Vue components render the preview, so it
//           can't drift from the real pages.

function previewRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
  })
  // Allow the initial navigation only, so links rendered by RouterLink don't navigate the preview
  router.beforeEach((_to, from) => from === START_LOCATION)
  return router
}

// Use the theme the site's ThemeToggle saved (the CMS shares its origin), otherwise the DaisyUI
// `prefersdark` default applies, like it does on the site
function applyTheme(doc: Document) {
  try {
    const theme = localStorage.getItem('theme')
    if (theme === LIGHT_THEME || theme === DARK_THEME) {
      doc.documentElement.setAttribute('data-theme', theme)
    }
  } catch {
    // Storage may be unavailable; the default theme still applies
  }
}

/** Locale of the pane being previewed: Sveltia sets it as the preview iframe's `<html lang>` */
export function previewLocale({ document }: PreviewTemplateProps): Locale {
  const language = document.documentElement.lang.split('-')[0]
  return isLocale(language) ? language : DEFAULT_LOCALE
}

/** A preview template rendering `component` with props from the entry. `toMessages` gives
 *  interface text to show in place of the saved text (for previewing ui.toml). */
export function vuePreview<P extends Record<string, unknown>>(
  component: Component,
  toProps: (props: PreviewTemplateProps, locale: Locale) => P | Promise<P>,
  toMessages?: (props: PreviewTemplateProps, locale: Locale) => Partial<Messages>,
): PreviewTemplate {
  return function VuePreview(props: PreviewTemplateProps) {
    const { createElement, useLayoutEffect, useRef } = window.CMS.React
    const container = useRef<HTMLDivElement | null>(null)
    const state = useRef<ShallowRef<P | undefined> | null>(null)
    const localeRef = useRef<Ref<Locale> | null>(null)
    const messagesRef = useRef<Ref<Partial<Messages>> | null>(null)

    // Mount once
    useLayoutEffect(() => {
      const current = shallowRef<P>()
      const locale = ref<Locale>(previewLocale(props))
      const messages = ref<Partial<Messages>>({})
      const app = createApp({ render: () => current.value && h(component, current.value) })
      app.use(previewRouter())
      app.provide(LOCALE_KEY, locale)
      app.provide(MESSAGES_KEY, messages)
      applyTheme(props.document)
      app.mount(container.current!)
      state.current = current
      localeRef.current = locale
      messagesRef.current = messages
      return () => {
        state.current = null
        localeRef.current = null
        messagesRef.current = null
        app.unmount()
      }
    }, [])

    // Update on every render (every edit); ignore async results that a newer edit has replaced
    useLayoutEffect(() => {
      const current = state.current
      const locale = previewLocale(props)
      if (localeRef.current) localeRef.current.value = locale
      if (messagesRef.current && toMessages) messagesRef.current.value = toMessages(props, locale)
      let stale = false
      const next = toProps(props, locale)
      if (next instanceof Promise) {
        next.then(
          (resolved) => {
            if (!stale && current) current.value = resolved
          },
          (error) => console.error(error),
        )
      } else if (current) {
        current.value = next
      }
      return () => {
        stale = true
      }
    })

    return createElement('div', { ref: container })
  }
}
