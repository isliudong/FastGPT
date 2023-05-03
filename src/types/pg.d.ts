import { KbDataStatusEnum } from '@/constants/plugins';

export interface PgKbDataItemType {
  id: string;
  q: string;
  a: string;
  status: `${KbDataStatusEnum}`;
  kb_id: string;
  user_id: string;
}
