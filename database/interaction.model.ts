import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';

const interactionSchema = new Schema(
  {
    user: { type: String, ref: 'User', required: true },
    action: { type: String, required: true },
    question: { type: String, ref: 'Question' },
    answer: { type: String, ref: 'Answer' },
    tags: [{ type: String, ref: 'Tag' }],
  },
  { timestamps: true },
);

export type IInteraction = HydratedDocument<
  InferSchemaType<typeof interactionSchema>
>;

const Interaction: Model<IInteraction> =
  models.Interaction || model('Interaction', interactionSchema);

export default Interaction;
