import {
  Document,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";
const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    questions: [{ type: String, ref: "Question" }],
    followers: [{ type: String, ref: "User" }],
  },
  { timestamps: true },
);

export type ITag = Document & InferSchemaType<typeof tagSchema>;

const Tag: Model<ITag> = models.Tag || model("Tag", tagSchema);

export default Tag;
