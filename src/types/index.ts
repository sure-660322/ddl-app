export type DdlStatus = 'active' | 'completed' | 'expired';

export interface Ddl {
  id: string;
  name: string;
  deadline: number;
  status: DdlStatus;
  createdAt: number;
}
