import { type DateTime } from "luxon";

import { type NewsContent } from "@/app/types/NewsContent";

export type BlackoutNewsEntry = {
  dateTimePosted: DateTime | string;
  dateTimeTarget: DateTime | string;
  content: NewsContent;
};