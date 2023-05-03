import type { KnowledgeBaseSchema } from './mongoSchema';

export interface KbItemType extends KnowledgeBaseSchema {
  totalData: number;
}
