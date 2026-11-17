// Typed in virtual-modules.d.ts (in tsconfig.app.json and tsconfig.vitest.json)
import images from 'virtual:site-images'

/** Site paths of every image in a folder of public/images/ (and its subfolders), e.g.
 *  `imagesIn('books')` → `/images/books/x.jpg`, ..., or of every image without a folder, for
 *  stories to choose from. Listed by .storybook/main.ts as Storybook starts. */
export function imagesIn(folder?: string): string[] {
  return folder ? images.filter((path) => path.startsWith(`/images/${folder}/`)) : images
}
