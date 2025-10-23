import { Axios } from "axios";

export default class BlackoutsParser {
  blackoutsData: Array<{
    queue: string;
    periods: Array<{
      start: string;
      end: string;
    }>;
  }> | null = null;

  fetchedBlackouts: Array<{
    id: number,
    date: string,
    htmlBody: string
  }> | null = null;

  constructor(public targetUrl: string) {

  }

  public async fetchBlackouts(): Promise<{
    id: number,
    date: string,
    htmlBody: string
  }[]> {
    const axios = new Axios();

    const res = await axios.get<string>(this.targetUrl)
      .then(response => response.data)
      .catch(e => {
        console.warn({e});
        return null;
      });

    const parsed = JSON.parse(res);
    this.fetchedBlackouts = parsed;
    return parsed || [];
  }

  public parseBlackouts(data?: string[]): Array<{
    queue: string;
    periods: Array<{
      start: string;
      end: string;
    }>;
  }> {
    const rawLines = data?.filter(line => line.length > 0).map(line => line.replace(/<\/?p>/g, ''));
    const blackouts: Array<{
      queue: string;
      periods: Array<{
        start: string;
        end: string;
      }>;
    }> = [];

    rawLines?.forEach(line => {
      // '1.1 08:00 - 10:00, 12:00 - 14:00' => '1.1', ['08:00', '-', '10:00,', '12:00', '-', '14:00']
      const [queuePart, ...rawPeriods] = line.split(" ");
      const periods = rawPeriods.filter(elem => elem !== "-");
      const periodsObjArray = [];

      for (let i = 0; i < periods.length; i += 2) {
        const start = periods[i].replace(',', '');
        const end = periods[i + 1].replace(',', '');
        periodsObjArray.push({ start, end });
      }

      return blackouts.push({
        queue: queuePart,
        periods: periodsObjArray
      })
    })

    this.blackoutsData = blackouts;

    return blackouts;
  }
}