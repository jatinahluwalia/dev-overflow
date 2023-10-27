"use server";

import Question, { IQuestion } from "@/database/question.model";
import { connectDB } from "../mongoose";
import Tag, { ITag } from "@/database/tag.model";
import { revalidatePath } from "next/cache";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsByTagIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User, { IUser } from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectDB();
    const { page = 1, pageSize = 10, searchQuery = "" } = params;
    const questions = await Question.find({
      $or: [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ],
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
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
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    await connectDB();

    const { questionId } = params;
    const question = Question.findById(questionId)
      .populate<{ tags: ITag[] }>({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate<{ author: IUser }>({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return question!;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectDB();

    const { hasdownVoted, hasupVoted, path, questionId, userId } = params;

    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // TODO: Increase author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectDB();

    const { hasdownVoted, hasupVoted, path, questionId, userId } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // TODO: Increase author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionsByTag = async (params: GetQuestionsByTagIdParams) => {
  try {
    await connectDB();

    const { tagId, page = 1, pageSize = 10, searchQuery = "" } = params;

    const tag = await Tag.findById(tagId)
      .populate<{
        questions: (IQuestion & {
          tags: ITag[];
          author: IUser;
        })[];
      }>({
        path: "questions",
        model: Question,
        options: {
          sort: { createdAt: -1 },
        },
        match: {
          $or: [
            {
              title: { $regex: new RegExp(searchQuery, "i") },
            },
            {
              content: { $regex: new RegExp(searchQuery, "i") },
            },
          ],
        },
        populate: [
          {
            path: "author",
            model: User,
            select: "_id name picture clerkId",
          },
          {
            path: "tags",
            model: Tag,
            select: "_id name",
          },
        ],
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (!tag) throw new Error("Tag not found");

    const questions = tag.questions;

    return { tag, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    await connectDB();
    const { path, questionId } = params;

    await Question.findByIdAndDelete(questionId);
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editQuestion = async (params: EditQuestionParams) => {
  try {
    await connectDB();
    const { path, questionId, content, title } = params;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { content, title },
      { new: true },
    );

    if (!updatedQuestion) throw new Error("Question not found");

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getHotQuestions = async () => {
  try {
    await connectDB();
    const questions = await Question.find()
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
