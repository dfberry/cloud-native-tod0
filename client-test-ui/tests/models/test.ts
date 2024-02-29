
// create type for edit with initial or updated
export type Edit = 'initial' | 'updated' | null;
export type Action = 'add' | 'edit' | 'delete';

export type TestData = {
  name: string;
  action: Action;
  edit: Edit;
  timeout: number;
  rowNumberInTable: number;
  incomingData: {
    title: string;
    description: string;
  } | null;
}