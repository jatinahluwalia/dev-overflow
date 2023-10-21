"use server";

import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import Tag, { ITag } from "@/database/tag.model";
import { revalidatePath } from "next/cache";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User, { IUser } from "@/database/user.model";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectDB();
    const questions = await Question.find()
      .populate<{
        tags: ITag[];
        author: IUser;
      }>([
        {
          path: "tags",
          model: Tag,
        },
        { path: "author", model: User },
      ])
      .sort({ createdAt: -1 });
    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createQuestion = async (params: CreateQuestionParams) => {
  try {
    await connectDB();
    const { title, content, tags, author, path } = params;
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
      tagDocs.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocs } },
    });

    revalidatePath(path);
  } catch (error) {}
};
