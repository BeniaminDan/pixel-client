// --- ENUMS ---
export enum PostStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

// --- INTERFACES / TYPES ---

/** Defines the structure for a user object. */
export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

/** Defines the structure for a blog post object. */
export interface Post {
    id: number;
    title: string;
    content: string;
    status: PostStatus;
    authorId: number;
}




