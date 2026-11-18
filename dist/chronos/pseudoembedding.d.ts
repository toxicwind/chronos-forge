/**
 * Pseudoembeddings — live pointers that act "real".
 *
 * Any large text/log/file body is stored as a chunk and referenced by a short
 * token. The token is a *pointer*, not a memory: retrieval is deterministic
 * (re-read the chunk), never "remembered".
 *
 *   chunk_id = pe_<sha256_16>
 *   token    = ⟦PE:pe_<sha256_16>⟧
 */
export declare const CHUNK_PREFIX = "pe_";
export interface Chunk {
    chunkId: string;
    encoding: 'gzip+base64';
    bytes: number;
    dataB64: string;
}
export declare function chunkIdFor(content: string | Buffer): string;
/** Content-addressable: identical bytes always yield the identical chunk id. */
export declare function makeChunk(content: string | Buffer): Chunk;
/** Inverse of {@link makeChunk}. Throws if the stored bytes do not match the id. */
export declare function retrieveChunk(chunk: Chunk): Buffer;
export declare function peToken(chunkId: string): string;
export declare const PE_TOKEN_PATTERN: RegExp;
/** Every pointer mentioned in a body of text. */
export declare function extractTokens(text: string): string[];
/**
 * In-memory chunk store. Deterministic and addressable — the same content
 * always lands at the same key, so a re-emitted chunk is idempotent.
 */
export declare class ChunkStore {
    private readonly chunks;
    put(content: string | Buffer): Chunk;
    get(chunkId: string): Chunk | undefined;
    /** Retrieve decoded bytes, or throw if the pointer is dangling. */
    retrieve(chunkId: string): Buffer;
    /** Resolve every pointer found in `text` to decoded bodies. */
    resolve(text: string): Array<{
        chunkId: string;
        body: Buffer;
    }>;
    get size(): number;
}
//# sourceMappingURL=pseudoembedding.d.ts.map