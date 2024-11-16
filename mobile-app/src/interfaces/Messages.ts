export interface Message {
    body: string;
    content_type?: string; // e.g., "text/plain"
    created_at?: string; // ISO string format
    id?: string; // UUID
    session_id?: string; // UUID
    source_id?: string; // UUID
    source_name: string;
    source_type: string; // e.g., "user"
    updated_at?: string; // ISO string format
}