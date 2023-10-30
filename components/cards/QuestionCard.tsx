import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { numberFormatter, dateFormatter } from "@/lib/utils";
import { ITag } from "@/database/tag.model";
import { IUser } from "@/database/user.model";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteActions from "../shared/EditDeleteActions";

interface Props {
  _id: string;
  title: string;
  tags: ITag[];
  author: IUser;
  upvotes: number;
  views: number;
  answers: string[];
  createdAt: Date;
  clerkId?: string;
}

const QuestionCard = ({
  _id,
  author,
  createdAt,
  tags,
  title,
  upvotes,
  views,
  answers,
  clerkId,
}: Props) => {
  return (
    <article className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {dateFormatter(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1 hover:underline">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {clerkId === author.clerkId && (
            <EditDeleteActions type="question" itemId={_id} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag.id} _id={tag.id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={`- asked ${dateFormatter(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex gap-5">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={numberFormatter(upvotes)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={numberFormatter(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={numberFormatter(views)}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </article>
  );
};

export default QuestionCard;
