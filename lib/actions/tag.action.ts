"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";
import { Types } from "mongoose";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams,
) => {
  try {
    await connectDB();

    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // TODO: Intereactions

    return [
      { name: "tag1", id: "1" },
      { name: "tag2", id: "2" },
      { name: "tag3", id: "3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    await connectDB();

    const { page = 1, pageSize = 10, searchQuery = "", filter } = params;

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find({
      name: { $regex: new RegExp(searchQuery, "i") },
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopPopularTags = async () => {
  try {
    await connectDB();

    const popularTags = await Tag.aggregate<{
      name: string;
      numberOfQuestions: number;
      _id: Types.ObjectId;
    }>([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    const tags = popularTags.map((tag) => ({
      ...tag,
      _id: tag._id.toString(),
    }));

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
