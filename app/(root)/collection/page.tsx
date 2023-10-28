import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();

  if (!userId) return redirect("/sign-in");

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">Saved Questions</h1>

      <div className="mt-11 flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions Here..."
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
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
            title="There's no saved questions to show"
            description={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati quis  numquam ea dicta voluptatum sunt!`}
            link={"/ask-question"}
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
