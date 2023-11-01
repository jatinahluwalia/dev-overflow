import JobCard from "@/components/cards/JobCard";
import CountriesFilter from "@/components/shared/CountriesFilter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { SearchParamsProps } from "@/types";
import { RootObject as CountryType } from "@/types/countries";
import { RootObject as JobType } from "@/types/jobs";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${
      searchParams.location
        ? `${searchParams.q || "software jobs"} in ${searchParams.location}`
        : `${searchParams.q || "software jobs"}`
    }&page=${searchParams.page || 1}`,
    {
      headers: {
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY || "",
      },
    },
  );

  const data: JobType = await result.json();

  const jobs = data.data;

  const countriesResponse = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2,flags",
  );
  const countriesData: CountryType[] = await countriesResponse.json();

  const countries = countriesData.map((item) => item.name.common);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-11 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job Title, Company, or Keywords"
        />
        <CountriesFilter data={countries} />
      </div>

      <div className="mt-10 flex flex-col gap-8">
        {jobs?.length > 0 ? (
          jobs?.map((job) => (
            <JobCard key={job.job_id} job={job} countriesData={countriesData} />
          ))
        ) : (
          <NoResult
            description="No jobs match your query"
            link="https://www.linkedin.com/"
            linkTitle="Check LinkedIn"
            title="No results"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={+(searchParams.page || "1")}
          isNext={jobs?.length === 10}
        />
      </div>
    </>
  );
};

export default Page;
