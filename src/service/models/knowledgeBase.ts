import { Schema, model, models, Model } from 'mongoose';
import { KnowledgeBaseSchema as SchemaType } from '@/types/mongoSchema';
const KnowledgeBaseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  updateTime: {
    type: Date,
    default: () => new Date()
  },
  name: {
    type: String,
    required: true
  }
});

export const KnowledgeBase: Model<SchemaType> =
  models['knowledgeBase'] || model('knowledgeBase', KnowledgeBaseSchema);
