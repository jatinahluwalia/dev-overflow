import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionsTab = async ({ userId, searchParams, clerkId }: Props) => {
  const page = +(searchParams.page || "1");
  const result = await getUserQuestions({ userId, page });
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
      <div className="mt-10">
        <Pagination isNext={result.isNext} pageNumber={page} />
      </div>
    </>
  );
};

export default QuestionsTab;
