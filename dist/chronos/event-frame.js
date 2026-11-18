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
export const STEPS = [
    'BOOTSTRAP',
    'SNAPSHOT',
    'EXHUME',
    'CARTO',
    'OPERATE',
    'SURGERY',
    'SYNTH',
    'APPLY',
    'PROOF',
    'CHECKPOINT',
    'RECURSE',
];
export const FRAME_PATTERN = /^\[CHR\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|(\d+)\|([A-Z]+)\|L(\d{6})\] (\{.*\})$/;
/** Monotonic line counter. One instance per emitting process. */
export class LineCounter {
    n = 0;
    next() {
        this.n += 1;
        return this.n;
    }
    get value() {
        return this.n;
    }
}
export function formatLine(n) {
    return 'L' + String(n).padStart(6, '0');
}
/**
 * Compose one framed line. `step` is explicit: it is a transport header
 * field, not part of the JSON payload, so it must never be inferred.
 */
export function frame(ctx, line, step, event) {
    const payload = JSON.stringify(event);
    return `[CHR|${ctx.repoHash}|${ctx.agentId}|${ctx.role}|${ctx.runId}|${ctx.cycle}|${step}|${formatLine(line)}] ${payload}`;
}
/** Parse a framed line. Returns null when the line is not a valid event. */
export function parseFrame(line) {
    const m = FRAME_PATTERN.exec(line.trimEnd());
    if (!m)
        return null;
    try {
        const event = JSON.parse(m[8]);
        return {
            frame: {
                repoHash: m[1],
                agentId: m[2],
                role: m[3],
                runId: m[4],
                cycle: Number(m[5]),
            },
            line: Number(m[7]),
            event,
        };
    }
    catch {
        return null;
    }
}
/** Emits framed events on a single stream. Never truncates, never swallows. */
export class EventBus {
    ctx;
    write;
    cycleProvider;
    counter = new LineCounter();
    /**
     * `cycleProvider` is evaluated at emit time, not construction time, so a
     * long-lived bus frames later cycles with the current cycle number.
     */
    constructor(ctx, write = (s) => process.stdout.write(s + '\n'), cycleProvider = () => ctx.cycle) {
        this.ctx = ctx;
        this.write = write;
        this.cycleProvider = cycleProvider;
    }
    emit(step, event) {
        const line = this.counter.next();
        const framed = frame({ ...this.ctx, cycle: this.cycleProvider() }, line, step, event);
        this.write(framed);
        return framed;
    }
    get line() {
        return this.counter.value;
    }
}
//# sourceMappingURL=event-frame.js.map