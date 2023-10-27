import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const AnswersTab = async ({ userId, searchParams, clerkId }: Props) => {
  const result = await getUserAnswers({ userId });
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item.id}
          _id={item.id}
          author={item.author}
          upvotes={item.upvotes.length}
          question={item.question}
          createdAt={item.createdAt}
          clerkId={clerkId}
        />
      ))}
    </>
  );
};

export default AnswersTab;
