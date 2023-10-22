import Metric from "@/components/shared/Metric";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatter } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { redirect } from "next/navigation";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import AnswerForm from "@/components/forms/AnswerForm";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";

dayjs.extend(relativeTime);

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params: { id } }: Props) => {
  const result = await getQuestionById({ questionId: id });
  if (!result) redirect("/");
  const { userId } = auth();
  let mongoUser;
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
              src={result.author.picture || ""}
              alt="Profile Photo"
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">VOTING</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="clock icon"
          value={` aksed ${dayjs(result.createdAt).fromNow()}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatter(result.answers?.length || 0)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatter(result.views || 0)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AnswerForm
        question={result.content}
        questionId={String(result._id)}
        authorId={String(mongoUser?._id)}
      />
    </>
  );
};

export default Page;