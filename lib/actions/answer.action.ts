"use server";

import Answer from "@/database/answer.model";
import { CreateAnswerParams } from "./shared.types";
import { connectDB } from "../mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

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
