/**
 * Host half of dsh-branch-companion.
 *
 * The feature lives entirely in the browser half (`./client`): selection action,
 * branch markers, tree panel. The Host half exists so the Loader can compose the
 * client bundle from this package; it registers no services, owns no state, and
 * exposes no model-facing surface.
 *
 * @module dsh-branch-companion
 */

/** Cordis plugin name. */
export const name = 'dsh-branch-companion'

/** No Host services are required. */
export const inject = []

/** Host side draws nothing; the browser half owns the whole UI. */
export function apply(): void {
  /* nothing to mount on the Host */
}
