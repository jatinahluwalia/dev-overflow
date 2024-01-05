"use server";

import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const searchableModels = ["question", "answer", "user", "tag"];

export const globalSearch = async (params: SearchParams) => {
  try {
    await connectDB();

    let result = [];

    const { query, type } = params;

    const regex = new RegExp(query || "", "i");

    const modelAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !searchableModels.includes(typeLower)) {
      // TODO: Search all models
      for (const { model, searchField, type } of modelAndTypes) {
        const queryResult = await (model as any)
          .find({ [searchField]: regex })
          .limit(2);

        result.push(
          ...queryResult.map((item: any) => ({
            title:
              type === "answer"
                ? `Answers containing ${regex.source}`
                : item[searchField],
            id:
              type === "answer"
                ? item.question
                : type === "user"
                  ? item.clerkId
                  : item.id,
            type,
          })),
        );
      }
    } else {
      const modelInfo = modelAndTypes.find((item) => item.type === typeLower);

      if (!modelInfo) throw new Error("Invalid search type");

      const queryResult = await (modelInfo.model as any)
        .find({ [modelInfo.searchField]: regex })
        .limit(8);

      result = queryResult.map((item: any) => ({
        title:
          type === "answer"
            ? `Answers containing ${regex.source}`
            : item[modelInfo.searchField],
        id:
          type === "answer"
            ? item.question
            : type === "user"
              ? item.clerkId
              : item.id,
        type,
      }));
    }

    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
