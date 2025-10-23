import { Table } from "@/app/components/Table";

export const BlackoutsTable = ({ bpData }:{ bpData: {
    date: string,
    blackouts: Array<{
      queue: string;
      periods: Array<{
        start: string;
        end: string;
      }>;
    }> | []
  }
} ) => {
  const labels: string[] = [];

  bpData.blackouts.forEach(blackout => {
    blackout.periods.forEach(period => {
      if (!labels.includes(period.start)){
        labels.push(period.start);
      }
      if (!labels.includes(period.end)){
        labels.push(period.end);
      }
    });
  });
  labels.sort();

  // push additional labels for missing times: e.g. if we have 08:00 and 10:00 -- add 09:00
  // also handles cases with half an hour marks present at least once in array
  const completeLabels: string[] = [];
  for (let i = 0; i < labels.length - 1; i++) {
    completeLabels.push(labels[i]);

    const [hour1, minute1] = labels[i].split(':').map(Number);
    const [hour2, minute2] = labels[i + 1].split(':').map(Number);

    const time1 = hour1 * 60 + minute1;
    const time2 = hour2 * 60 + minute2;

    if (time2 - time1 > 60) {
      const missingTime = time1 + 60;
      const missingHour = Math.floor(missingTime / 60);
      const missingMinute = missingTime % 60;
      const formattedMissingTime = `${missingHour.toString().padStart(2, '0')}:${missingMinute.toString().padStart(2, '0')}`;
      completeLabels.push(formattedMissingTime);
    }
  }
  completeLabels.push(labels[labels.length - 1]);


  return (
    <>
      <div className="p-5 w-full flex">
        <div className="max-w-50 min-w-50">
          <h1 className="text-xl mb-2">Blackouts for:</h1>
          <h1 className="text-xl">{bpData.date}</h1>
        </div>
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
          <Table labels={completeLabels} data={bpData.blackouts} />
        </div>
      </div>
    </>
  );
}