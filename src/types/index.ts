/**
 * Tipos auxiliares para o projeto Campanha Thiago Moura 2026
 * 
 * Este arquivo contém tipos auxiliares e re-exports dos tipos do Supabase
 * para facilitar o uso em toda a aplicação.
 * 
 * Última atualização: 2025-12-17T15:41:27.174Z
 */

// Re-export dos tipos principais do Supabase
export type { Database, Json } from './database.types';

// Tipos auxiliares para tabelas específicas
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Tipos para Views
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

// Tipos para Enums
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Tipos específicos do projeto (adicione conforme necessário)
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para autenticação
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

// Tipos para formulários
export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Tipos para filtros e ordenação
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Tipos para status de operações
export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

// Tipos para componentes comuns
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Tipos para notificações
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
