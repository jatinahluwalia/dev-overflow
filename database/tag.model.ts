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
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true },
);

export type ITag = Document &
  InferSchemaType<typeof tagSchema> & {
    _id: string;
    questions: string[];
    followers: string[];
  };

const Tag: Model<ITag> = models.Tag || model("Tag", tagSchema);

export default Tag;
