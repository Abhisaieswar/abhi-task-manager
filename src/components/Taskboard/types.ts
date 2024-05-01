export interface task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  from?: string;
  priority?: string;
  important?: boolean;
}

export interface dropdowns {
  label: string;
  value: string;
}

export const initialState: task = {
  id: "",
  title: "",
  description: "",
  assignedTo: "",
  status: "",
  createdAt: "",
  updatedAt: "",
  from: "",
  priority: "",
  important: false,
};

export interface allTasks {
  name: string;
  list: task[];
}
