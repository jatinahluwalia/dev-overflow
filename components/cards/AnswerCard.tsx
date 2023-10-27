import Link from "next/link";
import Metric from "../shared/Metric";
import { numberFormatter, dateFormatter } from "@/lib/utils";
import { IUser } from "@/database/user.model";
import { IQuestion } from "@/database/question.model";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteActions from "../shared/EditDeleteActions";

interface Props {
  _id: string;
  author: IUser;
  upvotes: number;
  createdAt: Date;
  clerkId?: string;
  question: IQuestion;
}

const AnswerCard = ({
  _id,
  author,
  createdAt,
  upvotes,
  clerkId,
  question,
}: Props) => {
  return (
    <Link href={`/question/${question.id}/${_id}`}>
      <article className="card-wrapper rounded-[10px] px-11 py-9">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {dateFormatter(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </div>

          <SignedIn>
            {clerkId === author.clerkId && (
              <EditDeleteActions type="answer" itemId={_id} />
            )}
          </SignedIn>
        </div>
        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Metric
            imgUrl={author.picture}
            alt="user"
            value={author.name}
            title={`- asked ${dateFormatter(createdAt)}`}
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
          </div>
        </div>
      </article>
    </Link>
  );
};

export default AnswerCard;
