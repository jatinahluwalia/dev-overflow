import { InferSchemaType, Model, Schema, model, models } from "mongoose";
const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true },
);

type ITag = InferSchemaType<typeof tagSchema>;

const Tag: Model<ITag> = models.Tag || model("Tag", tagSchema);

export default Tag;
