/**
 * Browser half of dsh-branch-companion.
 *
 * `apply` is the Cordis plugin body: it registers the dictionaries, mounts the
 * overlay, and hands the overlay's teardown to the plugin fiber so disabling the
 * plugin removes every listener and element it owns.
 *
 * @module dsh-branch-companion/client
 */
import type { ClientContext } from './types.js';
/** Services the overlay needs: Session forks, navigation, and copy. */
export declare const inject: readonly ["sessions", "uiWorkspace", "locale"];
/**
 * Mount the overlay once per page.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
