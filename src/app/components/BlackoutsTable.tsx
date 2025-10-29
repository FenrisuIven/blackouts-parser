import { Table } from "@/app/components/Table";
import { Blackout } from "@/app/types";
import {DateTime, DateTimeMaybeValid} from "luxon";

export const BlackoutsTable = ({ bpData, labels }:{ bpData:  {
    date: DateTimeMaybeValid | string
    blackouts: Array<Blackout>
  }, labels: Array<string>
} ) => {
  const date = typeof bpData.date === 'string' ? DateTime.fromISO(bpData.date).toFormat('dd.MM.yyyy') : bpData.date.toFormat('dd.MM.yyyy');

  return (
    <>
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">Blackout schedule for: {date}</h1>
      </div>
      <div className="p-5 w-full flex">
        <div className="max-w-70 min-w-70">
          {bpData.blackouts.map(blackout => {
            return <div key={`${blackout.queue}`} className="flex items-center gap-4">
              <h2 className="text-xl">{blackout.queue}:</h2>
              <div className="flex">
                {blackout.periods.map((period, index) => {
                  return <div key={`${period}-${index}`} className="mr-4">
                    <span>{period.start} - {period.end}</span>
                  </div>
                })}
              </div>
            </div>
          })}
        </div>
        <div className="flex w-full justify-center">
          <Table labels={labels} data={bpData.blackouts} />
        </div>
      </div>
    </>
  );
}