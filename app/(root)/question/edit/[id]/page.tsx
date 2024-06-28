import QuestionForm from '@/components/forms/QuestionForm';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Page = async ({ params: { id } }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return redirect('/sign-in');
  const mongoUser = await getUserById({ userId });

  const question = await getQuestionById({ questionId: id });
  if (!question) return null;

  if (mongoUser.id !== question.author.id)
    return 'You are not permitted to view this page';

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm
          mongoUserId={mongoUser.id}
          questionDetails={JSON.stringify(question)}
          type="edit"
        />
      </div>
    </>
  );
};

export default Page;
