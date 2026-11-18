/**
 * Per-repo state. The single source of truth for cycle position, freshness,
 * and the action log. Written atomically — a reader never sees a torn file.
 */
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
export const EMPTY_STATE = (repoHash, repoRoot) => ({
    repoHash,
    repoRoot,
    cycle: 0,
    head: '',
    dirty: '',
    actions: [],
    next: 'run MOE_CYCLE again; start at BOOTSTRAP',
    done: false,
    createdUtc: new Date().toISOString(),
    updatedUtc: new Date().toISOString(),
});
export function statePath(root) {
    return join(root, 'state.json');
}
export function readState(root) {
    const p = statePath(root);
    if (!existsSync(p)) {
        throw new Error(`no state.json at ${p} — run bootstrap first`);
    }
    return JSON.parse(readFileSync(p, 'utf8'));
}
/** Atomic write: temp file + rename, so a crash never leaves a half state. */
export function writeState(root, state) {
    mkdirSync(root, { recursive: true });
    const p = statePath(root);
    const tmp = `${p}.tmp`;
    state.updatedUtc = new Date().toISOString();
    writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
    renameSync(tmp, p);
}
export function loadOrInit(root, repoHash, repoRoot) {
    if (!existsSync(statePath(root)))
        return EMPTY_STATE(repoHash, repoRoot);
    return readState(root);
}
export function bumpCycle(state) {
    return { ...state, cycle: state.cycle + 1 };
}
export function appendAction(state, action) {
    return { ...state, actions: [...state.actions, action] };
}
/** Freshness guard: did the repo move underneath a prior plan? */
export function staleness(state, head, dirty) {
    return state.head !== head || state.dirty !== dirty;
}
export function ensureDir(p) {
    mkdirSync(dirname(p), { recursive: true });
}
//# sourceMappingURL=state.js.map