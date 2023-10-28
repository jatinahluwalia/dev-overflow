"use server";

import Answer from "@/database/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { connectDB } from "../mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User, { IUser } from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectDB();
    const { question, content, author, path } = params;

    const newAnswer = await Answer.create({ content, author, question });
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer.id },
    });
    revalidatePath(path);
    return "Created";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllAnswers = async (params: GetAnswersParams) => {
  try {
    await connectDB();
    const { questionId, page = 1, pageSize = 20, sortBy } = params;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate<{
        author: IUser;
      }>({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectDB();

    const { answerId, hasdownVoted, hasupVoted, path, userId } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Answer not found");

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectDB();

    const { answerId, hasdownVoted, hasupVoted, path, userId } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Answer not found");

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    await connectDB();
    const { path, answerId } = params;

    await Answer.findByIdAndDelete(answerId);
    await Question.updateOne(
      { answers: answerId },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ question: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
