export interface SoftDeleteEntidadeBase extends EntidadeBase {
    deletado: boolean;
}

export interface EntidadeBase {
    id?: number;
    createdAt?: string; // ISO 8601 string format for Instant
    updatedAt?: string; // ISO 8601 string format for Instant
}

