/**
 * Mutation clusters and the MoE expert panel.
 *
 * A cluster is a complete, standalone patch plan. The coordinator applies
 * EXACTLY ONE per cycle. Experts write independently — they never read each
 * other's output before writing their own.
 */
export type ClusterId = 'A' | 'B' | 'C';
export interface Cluster {
    id: ClusterId;
    goal: string;
    files: string[];
    commands: string[];
    patchPlan: string;
    proof: {
        command: string;
        expectedExcerpt: string;
    };
    rollback: string;
    risk: string;
    /** Populated by SYNTH. */
    score?: ClusterScore;
}
export interface ClusterScore {
    /** 1 command, observable excerpt. */
    proofability: number;
    /** Smallest change that unblocks the next cycle. */
    locality: number;
    /** Doesn't break tests / adds guardrails with evidence. */
    nonRegression: number;
    total: number;
}
export declare const ROLE_NAMES: readonly ["EXHUMER", "CARTOGRAPHER", "OPERATOR", "SURGEON", "SYNTH", "COORD"];
export type RoleName = (typeof ROLE_NAMES)[number];
export interface ExpertOutput {
    role: RoleName;
    cycle: number;
    artifact: string;
    clusters: Cluster[];
    /** Pseudoembedding tokens for large evidence bodies. */
    peRefs: string[];
    writtenUtc: string;
}
export interface RoleSpec {
    name: RoleName;
    mandate: string;
    artifact: string;
    readsRepo: boolean;
    editsRepo: boolean;
}
export declare const ROLE_SPECS: Record<Exclude<RoleName, 'COORD'>, RoleSpec>;
/** SYNTH scoring. Higher is better; all inputs are 0..5. */
export declare function scoreCluster(c: Cluster): ClusterScore;
/** Pick exactly one winner. Ties break toward the smaller blast radius. */
export declare function selectWinner(clusters: Cluster[]): Cluster | null;
//# sourceMappingURL=cluster.d.ts.map