import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import qs from "query-string";
import { CriteriaType } from "./actions/shared.types";
import { BadgeCounts } from "@/types";
import { BADGE_CRITERIA } from "@/constants";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const numberFormatter = Intl.NumberFormat("en", {
  notation: "compact",
}).format;

export const dateFormatter = (date: Date) => dayjs(date).fromNow();

export const formQueryURL = ({
  key,
  params,
  value,
}: {
  params: string;
  key: string;
  value: string;
}) => {
  const queries = qs.parse(params);

  queries[key] = value;

  return qs.stringify(queries, { skipNull: true });
};

export const removeQueryKeys = ({
  keys,
  params,
}: {
  keys: string[];
  params: string;
}) => {
  const queries = qs.parse(params);

  for (const key of keys) {
    delete queries[key];
  }

  return qs.stringify(queries);
};

export const assignBadges = (criteria: CriteriaType) => {
  const badgeCounts: BadgeCounts = {
    BRONZE: 0,
    GOLD: 0,
    SILVER: 0,
  };

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((badge) => {
      if (count >= badgeLevels[badge as keyof BadgeCounts]) {
        badgeCounts[badge as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
