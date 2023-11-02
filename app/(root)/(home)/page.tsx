import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

import { type Metadata } from "next";
import { type IQuestion } from "@/database/question.model";
import { type IUser } from "@/database/user.model";
import { ITag } from "@/database/tag.model";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Home | Dev Overflow",
  icons: {},
};

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  let result: {
    questions: (Omit<IQuestion, "author" | "tags"> & {
      author: IUser;
      tags: ITag[];
    })[];
    isNext: boolean;
  };

  if (searchParams.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        page: +(searchParams.page || "1"),
        searchQuery: searchParams.q,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: +(searchParams.page || "1"),
    });
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-dark100_light900 h1-bold">All Questions</h1>

        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 transition-all active:scale-90">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions Here..."
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question.id}
              _id={question.id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              createdAt={question.createdAt}
              answers={question.answers}
            />
          ))
        ) : (
          <NoResult
            title="There's no questions to show"
            description={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati quis  numquam ea dicta voluptatum sunt!`}
            link={"/ask-question"}
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          isNext={result.isNext}
          pageNumber={searchParams.page ? +searchParams.page : 1}
        />
      </div>
    </>
  );
};

export default Home;
