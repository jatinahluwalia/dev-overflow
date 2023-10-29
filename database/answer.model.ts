import {
  Schema,
  model,
  models,
  InferSchemaType,
  Model,
  Document,
} from "mongoose";

const answerSchema = new Schema(
  {
    author: { type: String, ref: "User", required: true },
    question: { type: String, ref: "Question", required: true },
    content: { type: String, required: true },
    upvotes: [{ type: String, required: true, ref: "User" }],
    downvotes: [{ type: String, required: true, ref: "User" }],
  },
  { timestamps: true },
);

export type IAnswer = Document & InferSchemaType<typeof answerSchema>;

const Answer: Model<IAnswer> = models.Answer || model("Answer", answerSchema);

export default Answer;
