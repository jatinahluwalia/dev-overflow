import Metric from '@/components/shared/Metric';
import { getQuestionById } from '@/lib/actions/question.action';
import { numberFormatter, dateFormatter } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import AnswerForm from '@/components/forms/AnswerForm';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.action';
import AllAnswers from '@/components/shared/AllAnswers';
import Votes from '@/components/shared/Votes';
import { URLProps } from '@/types';
import { IUser } from '@/database/user.model';

const Page = async ({ params: { id }, searchParams }: URLProps) => {
  const result = await getQuestionById({ questionId: id });
  if (!result) redirect('/');
  const { userId } = auth();
  let mongoUser: IUser;
  if (userId) mongoUser = await getUserById({ userId });
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture || ''}
              alt="Profile Photo"
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={result.id}
              userId={mongoUser?.id}
              upvotes={result.upvotes.length}
              hasUpvoted={result.upvotes.includes(mongoUser?.id)}
              downvotes={result.downvotes.length}
              hasDownvoted={result.downvotes.includes(mongoUser?.id)}
              hasSaved={mongoUser?.saved.includes(result.id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="clock icon"
          value={` aksed ${dateFormatter(result.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={numberFormatter(result.answers?.length || 0)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={numberFormatter(result.views || 0)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag) => (
          <RenderTag
            key={tag.id}
            _id={tag.id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={id}
        userId={mongoUser?.id}
        totalAnswers={result.answers.length}
        filter={searchParams.filter}
        page={+(searchParams.page || '1')}
      />

      {mongoUser && (
        <AnswerForm
          question={result.content}
          questionId={result.id}
          authorId={mongoUser.id}
        />
      )}
    </>
  );
};

export default Page;
