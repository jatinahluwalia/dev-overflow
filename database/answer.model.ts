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
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  },
  { timestamps: true },
);

type IAnswer = Document & InferSchemaType<typeof answerSchema>;

const Answer: Model<IAnswer> = models.Answer || model("Answer", answerSchema);

export default Answer;
