import { UserTag } from "@/enums/user.enums"

export interface Role {
  id: number
  name: string
  description?: string
}

export interface Permission {
  id: number
  name: string
  description?: string
}

export interface UserRole {
  userId: number
  roleId: number
  role: Role
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  avatar?: string | null;
  isActive: boolean;
  type_account: 'normal' | 'google' | 'facebook' | string;
  tag?: UserTag | null;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  createdAt: string;
  updatedAt: string;
  conversationId?: number;
  chatEnabled?: boolean;
  userRoles?: UserRole[]; // Quan hệ many-to-many với roles
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry' | 'userRoles'>; // Loại bỏ sensitive fields
    roles: string[]; // Array các role names
    permissions: string[]; // Array các permission names
    access_token: string;
  };
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    avatar?: string | null;
    isActive: boolean;
    type_account: 'normal' | 'google' | 'facebook' | string;
    tag?: UserTag | null;
    createdAt: string;
    updatedAt: string;
    conversationId?: number;
    chatEnabled?: boolean;
    roles: string[]; // Array các role names
    permissions: string[]; // Array các permission names
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    avatar?: string | null;
    isActive: boolean;
    type_account: 'normal' | 'google' | 'facebook' | string;
    tag?: UserTag | null;
    createdAt: string;
    updatedAt: string;
    shippingAddresses?: Array<{
      id: number;
      address: string;
      is_default: boolean;
    }>;
    userRoles: Array<{
      role: {
        id: number;
        name: string;
        description: string;
      };
    }>;
    _count: {
      orders: number;
      chatConversations: number;
      blogs: number;
      ProductReview: number;
    };
    roles: string[]; // Extracted từ userRoles
  };
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry'>;
}

export interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordBody {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}