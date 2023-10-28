import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionsByTag } from "@/lib/actions/question.action";
import { URLProps } from "@/types";

const Home = async ({ params: { id }, searchParams }: URLProps) => {
  const result = await getQuestionsByTag({
    tagId: id,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">{`${result.tag.name[0].toUpperCase()}${result.tag.name.slice(
        1,
      )}`}</h1>

      <div className="mt-11 flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions Here..."
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length ? (
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
            title="There's no questions with this tag to show"
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
