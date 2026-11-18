/**
 * Snapshot — the freshness guarantee that must run before any edit.
 *
 * Records git HEAD + dirty summary and the sha256+mtime of every file a
 * cluster intends to touch. Immediately before writing, the hashes are
 * re-checked; if anything moved, the cycle aborts rather than clobbering.
 */
import { createHash } from 'node:crypto';
import { statSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
function git(repoRoot, args) {
    try {
        return execFileSync('git', ['-C', repoRoot, ...args], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
    }
    catch {
        return '';
    }
}
export function snapshotRepo(repoRoot) {
    const head = git(repoRoot, ['rev-parse', 'HEAD']);
    const dirty = git(repoRoot, ['status', '-sb']).split('\n').slice(0, 50).join('\n');
    let recentFiles = [];
    if (head) {
        recentFiles = git(repoRoot, ['diff', '--name-only', 'HEAD~1..HEAD'])
            .split('\n')
            .filter(Boolean);
    }
    return { head, dirty, recentFiles, takenUtc: new Date().toISOString() };
}
/** sha256 + mtime for one file. Throws if unreadable. */
export function stampFile(path) {
    const st = statSync(path);
    const body = readFileSync(path);
    return {
        path,
        sha256: createHash('sha256').update(body).digest('hex'),
        mtimeMs: st.mtimeMs,
        bytes: st.size,
    };
}
export class FreshnessGuard {
    before = new Map();
    /** Record the pre-edit state of every target. */
    arm(paths) {
        const stamps = [];
        for (const p of paths) {
            const s = stampFile(p);
            this.before.set(p, s);
            stamps.push(s);
        }
        return stamps;
    }
    /** Re-check immediately before write. Returns the paths that changed. */
    drift() {
        const moved = [];
        for (const [p, s] of this.before) {
            let now;
            try {
                now = stampFile(p);
            }
            catch {
                moved.push(p); // vanished
                continue;
            }
            if (now.sha256 !== s.sha256 || now.mtimeMs !== s.mtimeMs)
                moved.push(p);
        }
        return moved;
    }
    get armed() {
        return this.before.size > 0;
    }
}
export class FreshnessViolation extends Error {
    changed;
    constructor(changed) {
        super(`files changed since arming: ${changed.join(', ')}`);
        this.changed = changed;
        this.name = 'FreshnessViolation';
    }
}
//# sourceMappingURL=snapshot.js.map