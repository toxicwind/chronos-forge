/**
 * Execution budget.
 *
 * The endless loop must never stall on one slow step. Every side-effecting
 * call — a lock wait, a proof command, a web lookup — runs under a hard
 * deadline. The default is 2000ms, which is the "maximal per execution"
 * budget: long enough for a fast smoke check, short enough that a hung
 * subprocess cannot freeze a cycle.
 */
export declare const DEFAULT_BUDGET_MS = 2000;
/**
 * Per-model execution budgets, measured live against
 * https://integrate.api.nvidia.com/v1/chat/completions on 2026-10-15
 * (prompt "Reply with exactly: OK", max_tokens=2048).
 *
 * Every one of these models is a reasoning model: low max_tokens budgets are
 * consumed by reasoning_content before any user-visible content is emitted.
 *
 * A budget of 0 marks a model that is known-broken (degraded endpoint or
 * hard timeout) — a proof against it should fail fast, not wait.
 */
export declare const MODEL_BUDGET_MS: Record<string, number>;
/**
 * Budget for a given model. Unknown models get `fallback`; known-broken
 * models (0) are preserved so callers can fail fast instead of stalling.
 */
export declare function modelBudget(modelId: string | undefined, fallback?: number): number;
/** True when the model is a known-broken endpoint (budget of 0). */
export declare function modelIsKnownBroken(modelId: string | undefined): boolean;
export declare class BudgetExceededError extends Error {
    readonly budgetMs: number;
    readonly label: string;
    constructor(budgetMs: number, label: string);
}
/**
 * Run `fn` under a deadline. Rejects with BudgetExceededError when the budget
 * is blown, so callers can pivot instead of hanging.
 */
export declare function withBudget<T>(fn: () => Promise<T> | T, budgetMs?: number, label?: string): Promise<T>;
export interface BoundedCommandResult {
    command: string;
    rc: number;
    stdout: string;
    stderr: string;
    timedOut: boolean;
    ms: number;
}
/**
 * Synchronous bounded shell execution. `spawnSync` already accepts a timeout;
 * this wraps it so every proof command in the loop carries the same cap and
 * reports whether the cap (rather than the command) ended it.
 */
export declare function boundedCommand(command: string, options?: {
    cwd?: string;
    budgetMs?: number;
}): BoundedCommandResult;
/** Clamp any caller-supplied budget to the hard ceiling. */
export declare function clampBudget(requested: number | undefined, ceiling?: number): number;
//# sourceMappingURL=timeout.d.ts.map