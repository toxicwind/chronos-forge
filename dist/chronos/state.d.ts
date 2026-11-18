/**
 * Per-repo state. The single source of truth for cycle position, freshness,
 * and the action log. Written atomically — a reader never sees a torn file.
 */
export interface Action {
    cycle: number;
    cluster: 'A' | 'B' | 'C';
    changed: string[];
    proofCmd: string;
    proofPe: string | null;
    head: string;
    utc: string;
}
export interface State {
    repoHash: string;
    repoRoot: string;
    cycle: number;
    head: string;
    dirty: string;
    actions: Action[];
    next: string;
    done: boolean;
    createdUtc: string;
    updatedUtc: string;
}
export declare const EMPTY_STATE: (repoHash: string, repoRoot: string) => State;
export declare function statePath(root: string): string;
export declare function readState(root: string): State;
/** Atomic write: temp file + rename, so a crash never leaves a half state. */
export declare function writeState(root: string, state: State): void;
export declare function loadOrInit(root: string, repoHash: string, repoRoot: string): State;
export declare function bumpCycle(state: State): State;
export declare function appendAction(state: State, action: Action): State;
/** Freshness guard: did the repo move underneath a prior plan? */
export declare function staleness(state: State, head: string, dirty: string): boolean;
export declare function ensureDir(p: string): void;
//# sourceMappingURL=state.d.ts.map