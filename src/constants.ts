export const AUTHOR_NAME = 'Jessica Barrett'
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://jessbarrett.ca'

export type Theme = 'lofi' | 'black'

export const LIGHT_THEME: Theme = 'lofi'
export const DARK_THEME: Theme = 'black'

// https://www.theamdash.com/
// https://chriscoyier.net/2025/05/10/the-am-dash/
export const AMDASH_FONTS = ['TimesNewHuman', 'Areal']
export const EMDASH_RE = /\u2014|&mdash;|--/g
export const AMDASH_HTML = '<span aria-hidden="true">am-</span><span class="sr-only">&mdash;</span>'
