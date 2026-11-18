/**
 * Deterministic identity derivation.
 *
 * repo_hash = first 10 hex of sha256(repo_root absolute path)
 * agent_id  = first 8 hex of sha256(hostname + uid + pane id)
 * run_id    = UTC timestamp compact + 6 random hex
 */
export declare function repoHash(repoRoot: string): string;
export declare function agentId(paneId?: string): string;
export declare function runId(now?: Date): string;
/**
 * Normalize so that the same logical path on the same OS yields one hash.
 * Windows is case-insensitive; separators are unified.
 */
export declare function normalizePath(p: string): string;
export declare function shortSha256(content: string | Buffer, length?: number): string;
//# sourceMappingURL=hashing.d.ts.map