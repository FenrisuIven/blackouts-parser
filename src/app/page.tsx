"use client"

import {DateTime, DateTimeMaybeValid} from "luxon"

import { BlackoutsTable } from "@/app/components/BlackoutsTable";
import BlackoutsParser from "@/app/classes/BlackoutsParser";
import { useEffect, useState } from "react";

import {type Blackout, BlackoutNewsEntry} from "@/app/types";

//TODO: Move out placeholder types
export default function Home() {
  const [ bpCookie, setBpCookie ] = useState<string | null>(null);
  const [ blackoutsData, setBlackoutsData ] = useState<{
    date: DateTimeMaybeValid | string,
    blackouts: Array<Blackout>
  } | null>(null);
  const [graphicsNews, setGraphicsNews] = useState<Array<BlackoutNewsEntry>>([]);

  const [labels, setLabels] = useState<Array<string>>([]);

  const BP = new BlackoutsParser('https://gita.cherkasyoblenergo.com/obl-main-controller//api/news');

  useEffect(() => {
    const bpData = localStorage.getItem('blackouts');

    if (!bpData) {
      BP.fetchBlackouts().then(fetchedData => {
        setBpCookie(JSON.stringify(fetchedData));
      });
      return;
    }

    const parsed: Array<BlackoutNewsEntry> = JSON.parse(bpData);
    const todaysDate = DateTime.now();
    const todaysEntryId = parsed.findIndex(item => {
      if (typeof item.dateTimePosted === 'string') {
        return DateTime.fromISO(item.dateTimePosted).toFormat('dd MM yyyy') === todaysDate.toFormat("dd MM yyyy");
      }
      return item.dateTimePosted.toFormat('dd MM yyyy') === todaysDate.toFormat("dd MM yyyy");
    });
    const latest = parsed[todaysEntryId === -1 ? 0 : todaysEntryId].dateTimePosted;

    // TODO: try fetching news by <latest-id> + 1
    //       if exists -- try refetching, since updates may have occurred
    if (latest instanceof DateTime && latest < todaysDate.minus({ hours: 1 })) {
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
      const parsedData: Array<BlackoutNewsEntry> = JSON.parse(bpCookie);

      setGraphicsNews(parsedData)

      const latestBlackoutData = parsedData[0].content.htmlBody.match(/<p>([1-6].+)<\/p>/gm)
      BP.parseBlackouts(latestBlackoutData || []);

      // TODO: Pass generated labels instead of generating them in the table component
      setLabels(BP.formLabels());
      setBlackoutsData({ date: parsedData[0].dateTimeTarget, blackouts: BP.blackoutsData || [] });

      console.log({ parsedData });
      localStorage.setItem('blackouts', JSON.stringify(parsedData));
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
            const LSdata = JSON.parse(bpCookie || '[]') as Array<BlackoutNewsEntry>;
            const targetEntry = LSdata.find(item => item.content.id === newValue);

            if (targetEntry) {
              const blackoutData = BP.parseBlackouts(
                targetEntry.content.htmlBody.match(/<p>([1-6].+)<\/p>/gm) || []
              );
              setBlackoutsData({ date: targetEntry.dateTimeTarget, blackouts: blackoutData });
            }
          }}>
            {graphicsNews.map(item => {
                const targetTime = typeof item.dateTimeTarget === 'string'
                  ? DateTime.fromISO(item.dateTimeTarget)
                  : item.dateTimeTarget;
                const postedTime = typeof item.dateTimePosted === 'string'
                  ? DateTime.fromISO(item.dateTimePosted)
                  : item.dateTimePosted;

                const target = targetTime.toFormat("dd.MM.yyyy, HH:mm");
                const update = postedTime.toFormat("dd.MM HH:mm");

                const updateIndicator = targetTime < postedTime ? 'upd: ' : '';

                return <option key={item.content.id} value={item.content.id}>
                  {target} ({updateIndicator}{update})
                </option>
              })
            }
          </select>
        </div>
      </div>
      <BlackoutsTable bpData={blackoutsData || {date: '', blackouts: []}} labels={labels}/>
    </div>
  );
}
