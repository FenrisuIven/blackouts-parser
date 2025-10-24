"use client"

import {DateTime} from "luxon"

import { BlackoutsTable } from "@/app/components/BlackoutsTable";
import BlackoutsParser from "@/app/classes/BlackoutsParser";
import { useEffect, useState } from "react";

//TODO: Move out placeholder types
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
  const [graphicsNews, setGraphicsNews] = useState<Array<{ id: number, date: string }>>([]);

  const BP = new BlackoutsParser('https://gita.cherkasyoblenergo.com/obl-main-controller//api/news');

  useEffect(() => {
    const bpData = localStorage.getItem('blackouts');

    if (!bpData) {
      BP.fetchBlackouts().then(fetchedData => {
        setBpCookie(JSON.stringify(fetchedData));
      });
      return;
    }

    const parsed: Array<{ id: number, date: string, htmlBody: string }> = JSON.parse(bpData);
    const todaysDate = DateTime.now().toFormat("dd.MM.yyyy");
    const todaysEntryId = parsed.findIndex(item => item.date.startsWith(todaysDate));
    const latest = DateTime.fromFormat(parsed[todaysEntryId === -1 ? 0 : todaysEntryId].date.split(" ")[0], "dd.MM.yyyy");

    // TODO: check the relevance by hours
    if (latest < DateTime.now().startOf('day')) {
      BP.fetchBlackouts().then(fetchedData => {
        setBpCookie(JSON.stringify(fetchedData));
      });
      return;
    }

    setBpCookie(bpData);
  }, [])

  useEffect(() => {
    console.log({ bpCookie });
    if(bpCookie) {
      const parsedData: Array<{ id: number, date: string, htmlBody: string }> = JSON.parse(bpCookie);

      const relatedToEnergy = parsedData.filter(item => item.htmlBody.includes("ГПВ"))
        .map(item => {
          return {
            id: item.id,
            date: item.date,
            htmlBody: item.htmlBody
          }
        });

      setGraphicsNews(relatedToEnergy
        .map(item => ({
          id: item.id,
          date: item.date
        }))
      )

      const latestBlackoutData = relatedToEnergy[0].htmlBody.match(/<p>([1-6].+)<\/p>/gm)
      BP.parseBlackouts(latestBlackoutData || []);

      // TODO: Pass generated labels instead of generating them in the table component
      BP.formLabels();
      setBlackoutsData({ date: relatedToEnergy[0].date, blackouts: BP.blackoutsData || [] });

      // TODO: change the obj to contain both the post date and "for day" date
      //       currently only post date is stored and is treated as "for day" date
      localStorage.setItem('blackouts', JSON.stringify(relatedToEnergy));
    }
  }, [bpCookie]);

  return (
    <div>
      <div className="p-5">
        <div className="max-w-50 min-w-50">
          <h1 className="text-xl mb-2">Blackouts for:</h1>
          <select onChange={(e) => {
            // TODO: set current date as default selected option
            const newValue = Number(e.target.value)

            // TODO: move out the selection logic into a separate function
            const LSdata = JSON.parse(bpCookie || '[]') as Array<{ id: number, date: string, htmlBody: string }>;
            const targetEntry = LSdata.find(item => item.id === newValue);

            if (targetEntry) {
              const blackoutData = BP.parseBlackouts(
                targetEntry.htmlBody.match(/<p>([1-6].+)<\/p>/gm) || []
              );
              setBlackoutsData({ date: targetEntry.date, blackouts: blackoutData });
            }
          }}>
            {graphicsNews.map(item => {
                console.log({item});
                return <option key={item.id} value={item.id}>{item.date}</option>
              })
            }
          </select>
        </div>
      </div>
      <BlackoutsTable bpData={blackoutsData || {date: '', blackouts: []}}/>
    </div>
  );
}
