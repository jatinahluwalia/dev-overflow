"use server";

import User, { IUser } from "@/database/user.model";
import { connectDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { FilterQuery } from "mongoose";

export const getUserById = async ({ userId }: { userId: string }) => {
  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const createUser = async (userData: CreateUserParams) => {
  try {
    await connectDB();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectDB();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectDB();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    // const questionIds = await Question.find({ author: user._id }).distinct(
    //   "_id",
    // );

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    await connectDB();
    const { page = 1, pageSize = 10, searchQuery = "", filter } = params;

    let sortOptions = {};

    switch (filter) {
      case "new_users": {
        sortOptions = { createdAt: -1 };
        break;
      }
      case "old_users": {
        sortOptions = { createdAt: 1 };
        break;
      }
      case "top_contributors": {
        sortOptions = { reputation: -1 };
        break;
      }

      default:
        break;
    }

    const query: FilterQuery<IUser> = {
      $or: [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ],
    };

    const users = await User.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const numberOfUsers = await User.countDocuments(query);

    const isNext = numberOfUsers > page * pageSize;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const saveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    await connectDB();

    const { path, questionId, userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    let updateQuery = {};

    if (user.saved.includes(questionId)) {
      updateQuery = { $pull: { saved: questionId } };
    } else {
      updateQuery = { $addToSet: { saved: questionId } };
    }

    await User.findByIdAndUpdate(userId, updateQuery);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    await connectDB();

    const {
      clerkId,
      page = 1,
      pageSize = 2,
      searchQuery = "",
      filter,
    } = params;

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId });
    // .populate<{
    //   saved: (Omit<IQuestion, "author" | "tags"> & {
    //     author: IUser;
    //     tags: ITag[];
    //   })[];
    // }>({
    //   path: "saved",
    //   match: { title: { $regex: new RegExp(searchQuery, "i") } },
    //   options: {

    //     skip: (page - 1) * pageSize,
    //     limit: pageSize,
    //     populate: [
    //       {
    //         path: "author",
    //         model: User,
    //         select: "_id clerkId name picture",
    //       },
    //       {
    //         path: "tags",
    //         model: Tag,
    //       },
    //     ],
    //     sort: sortOptions,
    //   },
    // });

    if (!user) throw new Error("User not found");

    // const questions = user.saved;

    const questionIds = user.saved;

    const query: FilterQuery<IQuestion> = {
      _id: { $in: questionIds },
      $or: [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ],
    };

    const questions = await Question.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions)
      .populate<{ author: IUser; tags: ITag[] }>([
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
        {
          path: "tags",
          model: Tag,
        },
      ]);

    const numberOfDocuments = await Question.countDocuments(query);

    const isNext = numberOfDocuments > page * pageSize;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    await connectDB();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({ author: user.id });
    const totalAnswers = await Answer.countDocuments({ author: user.id });

    const [questionUpvotes] = await Question.aggregate([
      {
        $match: { author: user.id },
      },
      {
        $project: { _id: 0, upvotes: { $size: "$upvotes" } },
      },
      {
        $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } },
      },
    ]);

    console.log({ questionUpvotes });

    if (!user) throw new Error("User not found");

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    await connectDB();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const questions = await Question.find({ author: userId })
      .sort({ views: -1 })
      .populate<{ author: IUser; tags: ITag[] }>([
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ])
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const isNext = totalQuestions > page * pageSize;

    return { totalQuestions, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    await connectDB();

    const { userId, page = 1, pageSize = 5 } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .sort({ views: -1 })
      .populate<{
        author: IUser;
        question: IQuestion;
      }>([
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
        { path: "question", model: Question, select: "_id title" },
      ])
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const isNext = totalAnswers > page * pageSize;

    return { totalAnswers, answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// export const getAllUsers = async (params: GetAllUsersParams) => {
//   try {
//     await connectDB();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
