import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionsTab = async ({ userId, searchParams, clerkId }: Props) => {
  const result = await getUserQuestions({ userId });
  return (
    <>
      {result.questions.map((item) => (
        <QuestionCard
          key={item.id}
          _id={item.id}
          title={item.title}
          tags={item.tags}
          author={item.author}
          upvotes={item.upvotes.length}
          views={item.views}
          answers={item.answers}
          createdAt={item.createdAt}
          clerkId={clerkId}
        />
      ))}
    </>
  );
};

export default QuestionsTab;
