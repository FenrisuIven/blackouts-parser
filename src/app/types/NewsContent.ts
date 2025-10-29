import { type DateTime } from "luxon";

export type NewsContent = {
  id: number,
  date: DateTime,
  htmlBody: string,
}