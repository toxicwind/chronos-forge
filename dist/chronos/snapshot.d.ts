/**
 * Snapshot — the freshness guarantee that must run before any edit.
 *
 * Records git HEAD + dirty summary and the sha256+mtime of every file a
 * cluster intends to touch. Immediately before writing, the hashes are
 * re-checked; if anything moved, the cycle aborts rather than clobbering.
 */
export interface FileStamp {
    path: string;
    sha256: string;
    mtimeMs: number;
    bytes: number;
}
export interface RepoSnapshot {
    head: string;
    dirty: string;
    recentFiles: string[];
    takenUtc: string;
}
export declare function snapshotRepo(repoRoot: string): RepoSnapshot;
/** sha256 + mtime for one file. Throws if unreadable. */
export declare function stampFile(path: string): FileStamp;
export declare class FreshnessGuard {
    private readonly before;
    /** Record the pre-edit state of every target. */
    arm(paths: string[]): FileStamp[];
    /** Re-check immediately before write. Returns the paths that changed. */
    drift(): string[];
    get armed(): boolean;
}
export declare class FreshnessViolation extends Error {
    readonly changed: string[];
    constructor(changed: string[]);
}
//# sourceMappingURL=snapshot.d.ts.map