export interface UserSummary {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  pronouns?: string;
  location?: string;
  website?: string;
  roles?: string[];
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostComment {
  id: string;
  author: UserSummary;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  likes?: number;
  viewerHasLiked?: boolean;
  comments?: PostComment[];
  commentsCount?: number;
  author: UserSummary;
}

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read?: boolean;
  data?: Record<string, unknown>;
}

export interface FollowRequest {
  id: string;
  user: UserSummary;
  createdAt: string;
}

export interface ConversationParticipant extends UserSummary {}

export interface ConversationSnapshot {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    sender: UserSummary;
  };
  unreadCount?: number;
  updatedAt?: string;
}

export type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiListResponse<T> {
  data?: T[];
  posts?: Post[];
  users?: UserSummary[];
}

export type Nullable<T> = T | null;