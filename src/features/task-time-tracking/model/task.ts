export interface Task {
  id: string;
  name: string;
  projectId: string;
}

export interface CreateTaskInput {
  name: string;
  projectId: string;
}
