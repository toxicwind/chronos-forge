/**
 * MOE_CYCLE — the only loop.
 *
 *   BOOTSTRAP -> SNAPSHOT -> (parallel experts) -> SYNTH -> APPLY -> PROOF
 *             -> CHECKPOINT -> RECURSE
 *
 * Coordinator invariants enforced here:
 *   - exactly ONE cluster is applied per cycle
 *   - the repo lock is held only to increment the cycle + checkpoint
 *   - the proof gate is mandatory: 1 command, 1 excerpt, 1 checkpoint append
 *   - freshness is re-checked immediately before every write
 */
import { ChunkStore } from './pseudoembedding.js';
import { type State } from './state.js';
import { type RepoSnapshot } from './snapshot.js';
import { type Cluster } from './cluster.js';
export interface ChronosConfig {
    repoRoot: string;
    /** Override the derived state root (defaults to <repoRoot>/.chronos). */
    stateRoot?: string;
    paneId?: string;
    /** Max cycles before the loop stops unless done is set. */
    maxCycles?: number;
    /** Shell out for real? When false, APPLY/PROOF are simulated. */
    dryRun?: boolean;
    /**
     * Model backing the agent, used to derive the proof budget from measured
     * latency (MODEL_BUDGET_MS). Ignored when executionBudgetMs is set.
     */
    model?: string;
    /** Hard per-execution ceiling in ms. Overrides the model-derived budget. */
    executionBudgetMs?: number;
}
export interface CycleResult {
    cycle: number;
    winner: Cluster | null;
    proof: {
        command: string;
        rc: number;
        excerptPe: string | null;
    } | null;
    checkpoint: State;
}
export declare class ChronosForge {
    private readonly cfg;
    readonly repoHash: string;
    readonly agentId: string;
    readonly runId: string;
    readonly stateRoot: string;
    readonly chunks: ChunkStore;
    private readonly bus;
    private state;
    private cycle;
    constructor(cfg: ChronosConfig);
    repoStateRoot(): string;
    /** Idempotent. Creates the per-repo control plane and the global hub. */
    bootstrap(): void;
    /** Read-only. Records HEAD/dirty and flags a moved repo. */
    snapshot(): {
        snap: RepoSnapshot;
        stale: boolean;
    };
    /**
     * Experts run independently and write one artifact each. This implementation
     * runs them sequentially but never lets a later expert read an earlier one's
     * output — the independence rule is preserved structurally.
     */
    private runExperts;
    /**
     * Applies exactly one cluster, guarded by freshness and the repo lock.
     * The lock is held only for the cycle increment + checkpoint.
     */
    private apply;
    /** The mandatory proof gate: 1 command, 1 observed excerpt, 1 checkpoint. */
    private proof;
    /**
     * Run one full cycle. Returns the result; the caller decides whether to
     * recurse. Exactly one cluster is applied.
     */
    runCycle(clusters: Cluster[]): CycleResult;
    /** Endless loop, bounded only by maxCycles or an explicit DONE flag. */
    run(clusters: Cluster[], onCycle?: (r: CycleResult) => void): CycleResult[];
    markDone(): void;
    private emit;
}
//# sourceMappingURL=cycle.d.ts.map