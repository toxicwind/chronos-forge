/**
 * WebSIFT — Search -> Ingest -> Filter -> Transform, triggered by warnings.
 *
 * Trigger rule (no exceptions): if any command output contains "warning",
 * "deprecated", "error", "traceback", "panic", "segfault", or "invalid
 * option", a diagnostic pivot runs immediately and the exact message string
 * plus the top library/tool name is looked up. Three concrete fixes are
 * extracted: minimal, conservative, refactor.
 */
export declare const TRIGGER_PATTERN: RegExp;
export interface SiftTrigger {
    matched: string;
    line: string;
    lineNumber: number;
    /** Best-effort extraction of the offending tool/library token. */
    tool: string | null;
}
export interface SiftSource {
    title: string;
    url: string;
    date?: string;
}
export interface SiftResult {
    trigger: SiftTrigger;
    queries: string[];
    sources: SiftSource[];
    undatedSourceCount: number;
    fixes: Array<{
        kind: 'minimal' | 'conservative' | 'refactor';
        summary: string;
    }>;
}
/** Scan command output for the first trigger-worthy line. */
export declare function detectTrigger(output: string): SiftTrigger | null;
/** Build the exact query strings to run against a search source. */
export declare function buildQueries(trigger: SiftTrigger, framework?: string): string[];
/**
 * Shape a diagnostic pivot. The three fix kinds are always present so the
 * cycle can choose the smallest working win.
 */
export declare function diagnosticPivot(trigger: SiftTrigger, sources?: SiftSource[]): SiftResult;
//# sourceMappingURL=websift.d.ts.map