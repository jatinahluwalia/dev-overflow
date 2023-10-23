"use server";

import Answer from "@/database/answer.model";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import { connectDB } from "../mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User, { IUser } from "@/database/user.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectDB();
    const { question, content, author, path } = params;

    const newAnswer = await Answer.create({ content, author, question });
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    revalidatePath(path);
    return "Updated";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllAnswers = async (params: GetAnswersParams) => {
  try {
    await connectDB();
    const {
      questionId,
      page = 1,
      pageSize = 20,
      sortBy = "createdAt",
    } = params;

    const answers = await Answer.find({ question: questionId })
      .populate<{ author: IUser }>({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
