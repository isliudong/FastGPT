import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, KnowledgeBase } from '@/service/mongo';
import { authToken } from '@/service/utils/auth';
import { PgClient } from '@/service/pg';
import { KbItemType } from '@/types/plugins';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error('无权操作');
    }

    // 凭证校验
    const userId = await authToken(authorization);

    await connectToDatabase();

    const kbList = await KnowledgeBase.find({
      userId
    }).sort({ updateTime: -1 });

    const data = await Promise.all(
      kbList.map(async (item) => ({
        _id: item._id,
        name: item.name,
        userId: item.userId,
        updateTime: item.updateTime,
        totalData: await PgClient.count('modelData', {
          where: [['user_id', userId], 'AND', ['kb_id', item._id]]
        })
      }))
    );

    jsonRes<KbItemType[]>(res, {
      data
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
