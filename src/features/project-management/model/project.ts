export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}
