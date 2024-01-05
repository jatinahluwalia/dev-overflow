"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery, Types } from "mongoose";
import Interaction from "@/database/interaction.model";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams,
) => {
  try {
    // await connectDB();

    // const { userId } = params;

    // const user = await User.findById(userId);
    // if (!user) throw new Error("User not found");

    // // TODO: Interactions

    // const tags = await Interaction.find({ user: userId })
    //   .sort({ createdAt: -1 })
    //   .distinct("tags");

    // const tagsArray = await Tag.find({ id: { $in: tags } }).limit(3);
    // return tagsArray;


    await connectDB();

    const { userId } = params;

     

    // Find tags where the followers array contains the userId
    const tagsWithUser = await Tag.find({ followers: userId });

    // Extract names from tags where user is a follower
    const tagNames = tagsWithUser.map((tag) => ({
      _id: tag._id.toString(),
      name: tag.name,
    }));

    return tagNames;
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

    const query: FilterQuery<ITag> = {
      name: { $regex: new RegExp(searchQuery, "i") },
    };

    const tags = await Tag.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOptions);

    const numberOfTags = await Tag.countDocuments(query);

    const isNext = numberOfTags > page * pageSize;

    return { tags, isNext };
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
