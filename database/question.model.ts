import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';
const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
    tags: [{ type: String, ref: 'Tag' }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: String, ref: 'User' }],
    downvotes: [{ type: String, ref: 'User' }],
    author: { type: String, ref: 'User' },
    answers: [{ type: String, ref: 'Answer' }],
  },
  { timestamps: true },
);

export type IQuestion = HydratedDocument<
  InferSchemaType<typeof questionSchema>
>;
const Question: Model<IQuestion> =
  models.Question || model('Question', questionSchema);

export default Question;
