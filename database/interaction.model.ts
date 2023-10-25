import {
  Schema,
  Document,
  InferSchemaType,
  model,
  models,
  Model,
} from "mongoose";

const interactionSchema = new Schema(
  {
    user: { type: String, ref: "User", required: true },
    action: { type: String, required: true, enum: ["view"] },
    question: { type: String, ref: "Question" },
    answer: { type: String, ref: "Answer" },
    tags: [{ type: String, ref: "Tag" }],
  },
  { timestamps: true },
);

export type IInteraction = Document & InferSchemaType<typeof interactionSchema>;

const Interaction: Model<IInteraction> =
  models.Interaction || model("Interaction", interactionSchema);

export default Interaction;
