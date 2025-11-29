export interface ParsedNode {
  id: string;
  label: string;
  type: string; // e.g., 'conv', 'linear', 'pool', 'input', 'output'
  description?: string;
  suggestedColor?: string;
}

export interface ParsedEdge {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: ParsedNode[];
  edges: ParsedEdge[];
}

// React Flow specific types extension
export interface NodeData {
  label: string;
  type: string;
  description?: string;
  color?: string;
  onChange?: (id: string, newData: Partial<NodeData>) => void;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UploadedFile {
  name: string;
  content: string;
}

export interface ChatResponse {
  answer: string;
  updatedGraph?: GraphData | null;
}
