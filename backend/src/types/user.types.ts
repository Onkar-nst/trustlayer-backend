export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  displayName?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  profile?: {
    displayName: string;
    avatarUrl?: string | null;
    bio?: string | null;
    isPublic: boolean;
  } | null;
  trustScore?: {
    total: number;
    lastRecalculatedAt: Date;
  } | null;
}
