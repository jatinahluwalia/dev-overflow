import { Datum as Job } from "@/types/jobs";
import { Badge } from "../ui/badge";
import Metric from "../shared/Metric";

import ImageWithFallback from "../shared/ImageWithFallback";
import Link from "next/link";
import Image from "next/image";
import { RootObject as CountryType } from "@/types/countries";

interface Props {
  job: Job;
  countriesData: CountryType[];
}

const JobCard = ({ job, countriesData }: Props) => {
  const flag = countriesData.find((country) => country.cca2 === job.job_country)
    ?.flags;
  return (
    <article className="background-light900_dark200 light-border flex justify-between gap-4 rounded-lg border p-8 dark:border-dark-300 max-xl:flex-col">
      <div className="grid grid-flow-col justify-start gap-6">
        <div className="background-light800_dark400 relative h-[64px] w-[64px] overflow-hidden rounded-xl">
          <ImageWithFallback
            src={job.employer_logo || "/assets/icons/fallback.svg"}
            fallbackUrl={"/assets/icons/fallback.svg"}
            width={0}
            height={0}
            sizes="100vw"
            alt="logo"
            className="h-full w-full object-contain object-center"
          />
        </div>
        <div className="max-w-[550px]">
          <div className="flex items-center gap-3">
            <p className="base-semibold text-dark200_light900">
              {job.job_title}
            </p>
            <Badge className="background-light800_dark400 subtle-medium rounded-md px-[14px] py-[7px] uppercase text-light-500">
              {job.job_publisher}
            </Badge>
          </div>
          <p className="body-regular text-dark500_light700 mt-2">
            {job.job_description.substring(0, 150)}...
          </p>
          <div className="mt-[20px] flex justify-start gap-6">
            <Metric
              alt="clock"
              imgUrl="/assets/icons/clock-2.svg"
              value={
                job.job_employment_type === "FULLTIME"
                  ? "Full-time"
                  : job.job_employment_type
              }
              textStyles="body-medium text-light-500"
              title=""
            />
            <Metric
              alt="salary"
              imgUrl="/assets/icons/currency-dollar-circle.svg"
              value={
                job.job_min_salary
                  ? `${job.job_min_salary} - ${job.job_max_salary}`
                  : "Salary not disclosed"
              }
              textStyles="body-medium text-light-500"
              title=""
            />
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between xl:flex-col">
        <Badge className="background-light800_dark400 flex gap-2 rounded-full py-[2px] pl-1 pr-[10px]">
          <Image
            src={flag?.svg || "/assets/icons/fallback.svg"}
            alt={flag?.alt || ""}
            width={18}
            height={18}
            className="object-contain object-center"
          />
          <p className="body-medium text-dark400_light700">
            {job.job_city ? `${job.job_city}, ` : ""}
            {job.job_country}
          </p>
        </Badge>
        <Link className="flex gap-2" href={job.job_apply_link}>
          <p className="body-semibold primary-text-gradient">View Job</p>
          <Image
            width={20}
            height={20}
            alt="arrow"
            src={"/assets/icons/arrow-up-right.svg"}
            className="object-contain object-center"
          />
        </Link>
      </div>
    </article>
  );
};

export default JobCard;
