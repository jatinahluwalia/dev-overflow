"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { saveQuestion } from "@/lib/actions/user.action";
import { numberFormatter } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  type: "question" | "answer";
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  downvotes,
  hasDownvoted,
  hasUpvoted,
  itemId,
  type,
  upvotes,
  userId,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    try {
      if (type !== "question") return;
      await saveQuestion({ path: pathname, questionId: itemId, userId });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (type === "question") viewQuestion({ questionId: itemId, userId });
  }, [pathname, router, itemId, userId, type]);

  const handleVote = async (action: "upvote" | "downvote") => {
    const upvoteToastMessage = hasUpvoted ? "Upvote removed" : "Upvote added";
    const downvoteToastMessage = hasDownvoted
      ? "Downvote removed"
      : "Downvote added";
    switch (type) {
      case "question": {
        switch (action) {
          case "upvote": {
            await upvoteQuestion({
              hasdownVoted: hasDownvoted,
              hasupVoted: hasUpvoted,
              questionId: itemId,
              path: pathname,
              userId,
            });
            toast.success(upvoteToastMessage);
            break;
          }
          case "downvote": {
            await downvoteQuestion({
              hasdownVoted: hasDownvoted,
              hasupVoted: hasUpvoted,
              questionId: itemId,
              path: pathname,
              userId,
            });
            toast.success(downvoteToastMessage);
            break;
          }
        }
        break;
      }
      case "answer": {
        switch (action) {
          case "upvote": {
            await upvoteAnswer({
              hasdownVoted: hasDownvoted,
              hasupVoted: hasUpvoted,
              answerId: itemId,
              path: pathname,
              userId,
            });
            toast.success(upvoteToastMessage);
            break;
          }
          case "downvote": {
            await downvoteAnswer({
              hasdownVoted: hasDownvoted,
              hasupVoted: hasUpvoted,
              answerId: itemId,
              path: pathname,
              userId,
            });
            toast.success(downvoteToastMessage);
            break;
          }
        }
        break;
      }
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer rounded-sm transition-all hover:bg-black/10 active:scale-75 dark:hover:bg-white/20"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {numberFormatter(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer rounded-sm transition-all hover:bg-black/10 active:scale-75 dark:hover:bg-white/20"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {numberFormatter(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={20}
          height={20}
          alt="star"
          className="cursor-pointer rounded-md px-0.5 transition-all hover:bg-black/10 active:scale-75 dark:hover:bg-white/20"
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};

export default Votes;
