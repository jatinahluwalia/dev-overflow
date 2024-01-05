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
  RecommendedParams,
} from "./shared.types";
import User, { IUser } from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";
import { getMongoId } from "../auth";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectDB();
    const { page = 1, pageSize = 10, searchQuery = "", filter } = params;

    const query: FilterQuery<IQuestion> = {
      $or: [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ],
    };

    if (filter === "unanswered") query.answers = { $size: 0 };

    let sortOptions = {};

    switch (filter) {
      case "newest": {
        sortOptions = { createdAt: -1 };
        break;
      }
      case "frequent": {
        sortOptions = { views: -1 };
        break;
      }

      default:
        break;
    }

    const questions = await Question.find(query)
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
      .sort(sortOptions);

    const numberOfDocuments = await Question.countDocuments(query);

    const isNext = numberOfDocuments > page * pageSize;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createQuestion = async (params: CreateQuestionParams) => {
  try {
    const { title, content, tags, author, path } = params;
    if ((await getMongoId()) !== author) throw new Error("Action not allowed");
    await connectDB();
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocs = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $addToSet: {
          questions: question._id, 
          followers: author, //? Add the author to the followers array to grab from tags gettopinteracted function and check this action
        }, },
        { upsert: true, new: true },
      );
      tagDocs.push(existingTag.id);
    }

    await Question.findByIdAndUpdate(question.id, {
      $push: { tags: { $each: tagDocs } },
    });

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question.id,
      tags: tagDocs,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);

    return question.id;
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
    const { hasdownVoted, hasupVoted, path, questionId, userId } = params;
    if ((await getMongoId()) !== userId) throw new Error("Action not allowed");
    await connectDB();

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

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    const { hasdownVoted, hasupVoted, path, questionId, userId } = params;
    if ((await getMongoId()) !== userId) throw new Error("Action not allowed");
    await connectDB();
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

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

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

    // const tag = await Tag.findById(tagId)
    //   .populate<{
    //     questions: (IQuestion & {
    //       tags: ITag[];
    //       author: IUser;
    //     })[];
    //   }>({
    //     path: "questions",
    //     model: Question,
    //     options: {
    //       sort: { createdAt: -1 },
    //     },
    //     match: {
    //       $or: [
    //         {
    //           title: { $regex: new RegExp(searchQuery, "i") },
    //         },
    //         {
    //           content: { $regex: new RegExp(searchQuery, "i") },
    //         },
    //       ],
    //     },
    //     populate: [
    //       {
    //         path: "author",
    //         model: User,
    //         select: "_id name picture clerkId",
    //       },
    //       {
    //         path: "tags",
    //         model: Tag,
    //         select: "_id name",
    //       },
    //     ],
    //   })
    //   .skip((page - 1) * pageSize)
    //   .limit(pageSize);
    // if (!tag) throw new Error("Tag not found");

    // const questions = tag.questions;

    const tag = await Tag.findById(tagId);

    if (!tag) throw new Error("Tag not found");

    const query: FilterQuery<IQuestion> = {
      $or: [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ],
      tags: tagId,
    };

    const questions = await Question.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate<{ author: IUser; tags: ITag[] }>([
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
      ]);

    const numberOfQuestions = await Question.countDocuments(query);

    const isNext = numberOfQuestions > page * pageSize;

    return { tag, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    await connectDB();
    const { path, questionId } = params;

    await Question.findOneAndDelete({
      id: questionId,
      author: await getMongoId(),
    });
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

    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId, author: await getMongoId() },
      { title, content },
    );

    if (!updatedQuestion)
      throw new Error("Either question not found or you are not authorized");

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

export const getRecommendedQuestions = async (params: RecommendedParams) => {
  try {
    const { userId, page = 1, pageSize = 10, searchQuery = "" } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found.");

    const userInteractionsTags = await Interaction.find({
      user: user.id,
    }).distinct("tags");

    const query: FilterQuery<IQuestion> = {
      tags: { $in: userInteractionsTags },
      author: { $ne: user.id },
      $or: [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ],
    };

    const questions = await Question.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate<{ author: IUser; tags: ITag[] }>([
        {
          path: "author",
          model: User,
          select: "_id name picture username",
        },
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
      ]);

    const totalQuestions = await Question.countDocuments(query);

    const isNext = totalQuestions > pageSize * page;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
