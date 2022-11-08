export interface INodeTemplate<T> {
  icon: string
  title: string
  description: string
  group: string
  make: T
}

export interface INodeEdit {
  title: string
  description: string
}

export declare enum FlowNodeType {
  ASSIGNMENT = 'Assignment',
  DECISION = 'Decision',
  LOOP = 'Loop',
}
