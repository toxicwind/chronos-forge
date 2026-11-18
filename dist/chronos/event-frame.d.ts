/**
 * Event framing — "stdout is the transport".
 *
 * Every actionable line emitted by the backplane MUST be exactly:
 *
 *   [CHR|<repo_hash>|<agent_id>|<role>|<run_id>|<cycle>|<step>|L000001] {json}
 *
 * The line counter is monotonic per process. Anything that does not fit this
 * shape is not an event and must not be parsed as one.
 */
export declare const STEPS: readonly ["BOOTSTRAP", "SNAPSHOT", "EXHUME", "CARTO", "OPERATE", "SURGERY", "SYNTH", "APPLY", "PROOF", "CHECKPOINT", "RECURSE"];
export type Step = (typeof STEPS)[number];
export type Role = 'EXHUMER' | 'CARTOGRAPHER' | 'OPERATOR' | 'SURGEON' | 'SYNTH' | 'COORD';
/** The minimum event types the transport understands. */
export type EventType = 'cmd' | 'stdout' | 'stderr' | 'file_read' | 'file_write' | 'decision' | 'proof' | 'checkpoint' | 'OUTPUT_CHUNKS' | 'EXHUME' | 'warning';
export interface Event {
    type: EventType;
    [key: string]: unknown;
}
export interface FrameContext {
    repoHash: string;
    agentId: string;
    role: Role;
    runId: string;
    cycle: number;
}
export declare const FRAME_PATTERN: RegExp;
/** Monotonic line counter. One instance per emitting process. */
export declare class LineCounter {
    private n;
    next(): number;
    get value(): number;
}
export declare function formatLine(n: number): string;
/**
 * Compose one framed line. `step` is explicit: it is a transport header
 * field, not part of the JSON payload, so it must never be inferred.
 */
export declare function frame(ctx: FrameContext, line: number, step: Step, event: Event): string;
/** Parse a framed line. Returns null when the line is not a valid event. */
export declare function parseFrame(line: string): {
    frame: FrameContext;
    line: number;
    event: Event;
} | null;
/** Emits framed events on a single stream. Never truncates, never swallows. */
export declare class EventBus {
    private readonly ctx;
    private readonly write;
    private readonly cycleProvider;
    private counter;
    /**
     * `cycleProvider` is evaluated at emit time, not construction time, so a
     * long-lived bus frames later cycles with the current cycle number.
     */
    constructor(ctx: FrameContext, write?: (s: string) => void, cycleProvider?: () => number);
    emit(step: Step, event: Event): string;
    get line(): number;
}
//# sourceMappingURL=event-frame.d.ts.map