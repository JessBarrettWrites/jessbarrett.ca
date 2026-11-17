// DEV NOTE: A story's play function runs as fast as the browser allows, too fast to follow by eye.
//           Pausing between its steps lets each one be seen as it plays in the Interactions panel.

/** Wait between a play function's steps */
export const pause = (ms = 800) => new Promise<void>((resolve) => setTimeout(resolve, ms))
