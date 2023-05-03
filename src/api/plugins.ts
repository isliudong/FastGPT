import { GET, POST, PUT, DELETE } from './request';
import type { KbItemType } from '@/types/plugins';
import { RequestPaging } from '../types/index';
import { Obj2Query } from '@/utils/tools';

/* knowledge base */
export const getKbList = () => GET<KbItemType[]>(`/plugins/knowledgeBase/list`);

export const postCreateKb = (data: { name: string }) =>
  POST<string>(`/plugins/knowledgeBase/create`, data);
export const putUpdateKbById = (data: { id: string; name: string }) =>
  PUT(`/plugins/knowledgeBase/update`, data);

export const delKbById = (id: string) => DELETE(`/plugins/knowledgeBase/delete?id=${id}`);

type GetKbDataListProps = RequestPaging & {
  kbId: string;
  searchText: string;
};
export const getKbDataList = (props: GetKbDataListProps) =>
  GET(`/plugins/knowledgeBase/getDataList?${Obj2Query(props)}`);
