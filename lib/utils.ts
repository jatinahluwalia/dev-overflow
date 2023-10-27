import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import qs from "query-string";

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
