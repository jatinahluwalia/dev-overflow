import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: "1",
    title: "Cascading deletes in SQL?",
    tags: [
      { _id: "1", name: "SQL" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "1", name: "CSS" },
      { _id: "2", name: "Python" },
    ],
    author: { _id: "1", name: "John Doe", picture: "" },
    uploads: 10,
    views: 10,
    answers: 10,
    createdAt: new Date(),
    upvotes: 10,
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-dark100_light900 h1-bold">All Questions</h1>

        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
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
          otherClasses="sm:max-h-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              createdAt={question.createdAt}
              answers={[]}
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
    </>
  );
};

export default Home;
