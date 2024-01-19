export interface Todo extends NewTodo {
  id: number;
  createdAt?: string | null;
  updatedAt?: string | null;
} 

export interface NewTodo {
  title: string;
  description?: string;
}
