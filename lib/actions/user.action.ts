"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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
// export const getAllUsers = async (params: GetAllUsersParams) => {
//   try {
//     await connectDB();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
