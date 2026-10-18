/**
 * Browser half of dsh-branch-companion.
 *
 * `apply` is the Cordis plugin body: it registers the dictionaries, mounts the
 * overlay, and hands the overlay's teardown to the plugin fiber so disabling the
 * plugin removes every listener and element it owns.
 *
 * @module dsh-branch-companion/client
 */

import en from '../../locale/en.json'
import zh from '../../locale/zh.json'
import { BranchOverlay } from './overlay.js'
import type { ClientContext } from './types.js'

/** Dictionary namespace owned by this plugin. */
const NS = 'branch'

/** Services the overlay needs: Session forks, navigation, and copy. */
export const inject = ['sessions', 'uiWorkspace', 'locale'] as const

/**
 * Mount the overlay once per page.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  if (typeof document === 'undefined' || document.body === null) return
  if (document.getElementById('dsh-branch-root') !== null) return

  const disposeLocale = ctx.locale.register(NS, { zh, en })
  const overlay = new BranchOverlay(ctx, ctx.locale.bind(NS))
  overlay.mount()

  ctx.effect?.(() => () => {
    overlay.dispose()
    disposeLocale()
  }, 'dsh-branch-companion: overlay')
}
