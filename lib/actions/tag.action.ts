"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

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
      { name: "tag1", _id: "1" },
      { name: "tag2", _id: "2" },
      { name: "tag3", _id: "3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getAllTags = async (_params: GetAllTagsParams) => {
  try {
    await connectDB();
    const tags = await Tag.find({});
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
