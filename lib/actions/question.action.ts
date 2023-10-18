"use server";

import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import Tag from "@/database/tag.model";
import { revalidatePath } from "next/cache";

export const createQuestion = async (props: {
  title: string;
  content: string;
  tags: string[];
  author: string;
  path: string;
}) => {
  try {
    await connectDB();
    const { title, content, tags, author, path } = props;
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocs = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );
      tagDocs.push(existingTag);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocs } },
    });

    revalidatePath(path);
  } catch (error) {}
};
