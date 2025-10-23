import {DateTime} from "luxon";

export const Table = ({ labels, data }: {
  labels: string[],
  data: {
    queue: string,
    periods: Array<{
      start: string, end: string
    }>
  }[]
}) => {
  let currentLabel = '';

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="border-2 border-white min-w-15 text-center"/>
        {labels.map((label) => {
          const key = crypto.randomUUID();
          let className = "border-2 border-white min-w-15 text-center";
          if (!currentLabel) {
            const currentTime = DateTime.now().toFormat("HH:00");
            const isCurrent = label === currentTime;
            if (isCurrent) {
              className += " bg-orange-300 text-black font-bold";
              currentLabel = currentTime;
            }
          }
          return <div key={key} className={className}>{label}</div>
        })}
      </div>
      <data className="flex flex-col">
        {data.map(blackout => {
          const key = crypto.randomUUID();

          return <div className="flex" key={key}>
            <div className="min-w-15 h-10 border-2 border-white text-center align-middle flex flex-wrap content-center justify-center">{blackout.queue}</div>
              {Array.from({length: labels.length}).map((_, idx) => {
                const blKey = crypto.randomUUID();
                const isPeriodRelevant = blackout.periods.some(period => {
                  if (period.start === labels[idx] || period.end === labels[idx]) {
                    return true;
                  }
                  return labels[idx] > period.start && labels[idx] < period.end;
                });

                const isCurrent = labels[idx] === currentLabel;
                let className = `min-w-15 h-10 border-2 border-white`;
                if (isCurrent) {
                  className += ` ${isPeriodRelevant ? 'bg-rose-600' : 'bg-gray-700'}`;
                } else {
                  className += ` ${isPeriodRelevant ? 'bg-red-400' : 'bg-gray-500'}`;
                }

                return <div key={blKey} className={className}/>
              })}
            </div>
        })}
      </data>
    </div>
  );
}