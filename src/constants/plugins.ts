export enum KbDataStatusEnum {
  ready = 'ready',
  waiting = 'waiting'
}

export const KbDataStatusMap: Record<`${KbDataStatusEnum}`, string> = {
  ready: '训练完成',
  waiting: '训练中'
};
