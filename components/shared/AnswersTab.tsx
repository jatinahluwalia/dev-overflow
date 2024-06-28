import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const AnswersTab = async ({ userId, searchParams, clerkId }: Props) => {
  const page = +(searchParams.page || '1');
  const result = await getUserAnswers({ userId, page });
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
      <div className="mt-10">
        <Pagination pageNumber={page} isNext={result.isNext} />
      </div>
    </>
  );
};

export default AnswersTab;
