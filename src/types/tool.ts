/** AITool data model matching backend schema. */
export interface AITool {
  id: number;
  name: string;
  vendor: string;
  department: string;
  approved: boolean;
  user_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AIToolCreate {
  name: string;
  vendor: string;
  department: string;
  approved?: boolean;
  user_count?: number;
  notes?: string;
}

export interface AIToolUpdate extends Partial<AIToolCreate> {}

export interface PaginatedTools {
  items: AITool[];
  total: number;
  offset: number;
  limit: number;
}
