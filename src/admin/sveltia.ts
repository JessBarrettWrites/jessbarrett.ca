// The parts of the Sveltia CMS API used by the previews, which the CMS script loaded by
// `public/admin/index.html` exposes as `window.CMS`.
// https://sveltiacms.app/en/docs/api/preview-templates

/** An Immutable.js Map, as preview templates receive entries */
export interface ImmutableMap {
  get(key: string): any
  toJS(): any
}

export interface PreviewAsset {
  toString(): string
}

export interface PreviewTemplateProps {
  entry: ImmutableMap
  getAsset(path: string): PreviewAsset | undefined
  getCollection(name: string, slug?: string): Promise<ImmutableMap[] | ImmutableMap>
  /** The preview iframe's document */
  document: Document
  window: Window
}

/** The CMS-bundled React; hooks only work when taken from this instance */
export interface SveltiaReact {
  createElement(type: string, props: Record<string, unknown>): unknown
  useRef<T>(initial: T): { current: T }
  useLayoutEffect(effect: () => void | (() => void), deps?: unknown[]): void
}

export type PreviewTemplate = (props: PreviewTemplateProps) => unknown

export interface SveltiaCMS {
  React: SveltiaReact
  registerPreviewTemplate(name: string, component: PreviewTemplate): void
  registerPreviewStyle(
    style: string,
    options?: { raw?: boolean; collection?: string; file?: string },
  ): void
}

declare global {
  interface Window {
    CMS: SveltiaCMS
  }
}
