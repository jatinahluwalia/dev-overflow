"use server";

import User, { IUser } from "@/database/user.model";
import { connectDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import Answer from "@/database/answer.model";

export const getUserById = async ({ userId }: { userId: string }) => {
  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });
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
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
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

    const { clerkId, page = 1, pageSize = 20, searchQuery = "" } = params;

    const user = await getUserById({ userId: clerkId });

    if (!user) throw new Error("User not found");

    const questionIds = user.saved;

    const questions = await Question.find({
      _id: { $in: questionIds },
      $or: [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ],
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
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

    return { questions };
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

    if (!user) throw new Error("User not found");

    return { user, totalQuestions, totalAnswers };
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
