/**
 * Cross-platform advisory lock.
 *
 * The original design assumed `flock(1)` from util-linux, which does not exist
 * on Windows. This module gives the same semantics on both platforms:
 *
 *   - exclusive or shared
 *   - blocking, non-blocking, or bounded-wait
 *   - held only for the duration of a critical section
 *
 * On POSIX it shells out to `flock(1)` (the reference implementation). On
 * Windows it uses an exclusive-create marker file, since there is no portable
 * byte-range lock available from plain Node.
 */
export type LockMode = 'exclusive' | 'shared';
export interface LockOptions {
    mode?: LockMode;
    nonblock?: boolean;
    /** Seconds to wait before giving up. Ignored when nonblock is set. */
    timeoutSeconds?: number;
}
export declare class LockTimeoutError extends Error {
    readonly path: string;
    readonly waitedSeconds: number;
    constructor(path: string, waitedSeconds: number);
}
export declare class LockBusyError extends Error {
    readonly path: string;
    constructor(path: string);
}
/** True when a real `flock` binary is on PATH. */
export declare function hasFlock(): boolean;
/**
 * Portable advisory lock. `acquire()` is safe to call twice (second is a
 * no-op); `release()` is safe to call when not held.
 */
export declare class Lock {
    readonly path: string;
    private held;
    constructor(path: string);
    acquire(options?: LockOptions): void;
    /** Hold the lock for the duration of a trivial child process. */
    private acquireViaFlock;
    /**
     * Marker-file lock. The file's existence is the "held" signal; the marker
     * records the holder so a stale lock can be diagnosed.
     */
    private acquireViaMarkerFile;
    release(): void;
    /** Run `fn` with the lock held; always releases, even on throw. */
    with<T>(fn: () => T, options?: LockOptions): T;
}
//# sourceMappingURL=lock.d.ts.map