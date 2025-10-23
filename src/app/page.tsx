"use client"

import {DateTime} from "luxon"

import { BlackoutsTable } from "@/app/components/BlackoutsTable";
import BlackoutsParser from "@/app/classes/BlackoutsParser";
import { useEffect, useState } from "react";

// scary shi
export default function Home() {
  const [ bpCookie, setBpCookie ] = useState<string | null>(null);
  const [ blackoutsData, setBlackoutsData ] = useState<{
    date: string,
    blackouts: Array<{
      queue: string;
      periods: Array<{
        start: string;
        end: string;
      }>;
    }>
  } | null>(null);

  const BP = new BlackoutsParser('https://gita.cherkasyoblenergo.com/obl-main-controller//api/news');

  useEffect(() => {
    const bpData = localStorage.getItem('blackouts');

    if (!bpData) { //if val in LS is not set -- refetch the data from API
      BP.fetchBlackouts().then(fetchedData => {
        setBpCookie(JSON.stringify(fetchedData));
      });
      return;
    }

    const parsed: Array<{ id: number, date: string, htmlBody: string }> = JSON.parse(bpData);
    const latest = DateTime.fromFormat(parsed[0].date.split(" ")[0], "dd.MM.yyyy");

    // if the latest data is older than today -- refetch
    // should ideally be a check for the specific amount of hours, but this works for now
    if (latest < DateTime.now().startOf('day')) {
      BP.fetchBlackouts().then(fetchedData => {
        setBpCookie(JSON.stringify(fetchedData));
      });
      return;
    }

    setBpCookie(bpData);
  }, [])

  // when bpCookie is set -- parse and set blackouts data
  useEffect(() => {
    console.log({ bpCookie });
    if(bpCookie) {
      const parsedData: Array<{ id: number, date: string, htmlBody: string }> = JSON.parse(bpCookie);

      // get only news entries related to energy blackouts
      // those conveniently always contain the "ГПВ" substring somewhere in the htmlBody
      const relatedToEnergy = parsedData.filter(item => item.htmlBody.includes("ГПВ"))
        .map(item => {
          return {
            id: item.id,
            date: item.date,
            htmlBody: item.htmlBody
          }
        });

      console.log({ relatedToEnergy });
      localStorage.setItem('blackouts', JSON.stringify(relatedToEnergy));

      // since the htmlBody contains full news text,
      // we need to extract only the relevant parts with blackout schedules,
      // which are always in <p> tags starting with a number from 1 to 6
      const latestBlackoutData = relatedToEnergy[0].htmlBody.match(/<p>([1-6].+)<\/p>/gm)
      const blackouts = BP.parseBlackouts(latestBlackoutData || []);

      setBlackoutsData({ date: relatedToEnergy[0].date, blackouts })
    }
  }, [bpCookie]);

  return (
    <div>
      <BlackoutsTable bpData={blackoutsData || {date: '', blackouts: []}}/>
    </div>
  );
}
