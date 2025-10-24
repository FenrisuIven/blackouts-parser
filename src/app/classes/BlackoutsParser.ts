import { Axios } from "axios";
import { DateTime } from "luxon";

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

  labels: Array<string> | null = null;
  startingTime: DateTime | null = null;
  endingTime: DateTime | null = null;

  constructor(
    public targetUrl: string,
  ) {

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

    const parsed = JSON.parse(res || '');
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
    this.setEndingTimes();

    return blackouts;
  }

  /*public findTargetTime({ isSearchingForMin }: { isSearchingForMin?: boolean }) {
    if (!this.blackoutsData) return;

    const startingTime = isSearchingForMin ? this.blackoutsData[0].periods[0].start : this.blackoutsData[0].periods[0].end;
    let targetTime = DateTime.fromFormat(startingTime, "HH:mm");

    for (const blackout of this.blackoutsData) {
      blackout.periods.forEach(period => {
        const start = DateTime.fromFormat(period.start, "HH:mm");
        const end = DateTime.fromFormat(period.end, "HH:mm");

        if (isSearchingForMin !== (start > targetTime)) {
          targetTime = start;
        }
        if (isSearchingForMin !== (end > targetTime)) {
          targetTime = end;
        }
      })
    }

    return targetTime;
  }*/

  private setEndingTimes() {
    if (!this.blackoutsData) return;

    // TODO: refactor to use findTargetTime for both starting and ending times
    this.startingTime = DateTime.fromFormat(this.blackoutsData[0].periods[0].start, "HH:mm");
    let endingTime = DateTime.fromFormat(this.blackoutsData[0].periods[0].end, "HH:mm");
    for (const blackout of this.blackoutsData) {
      blackout.periods.forEach(period => {
        const start= DateTime.fromFormat(period.start, "HH:mm");
        const end= DateTime.fromFormat(period.end, "HH:mm");
        if (start > endingTime) {
          endingTime = start;
        }
        if (end > endingTime) {
          endingTime = end;
        }
      })
    }
    this.endingTime = endingTime;
  }

  public formLabels() {
    if (!this.blackoutsData) return;
    if (!this.startingTime || !this.endingTime) return;

    const labels = [];

    const isHalvesPresent = this.blackoutsData.some((blackout) => {
      return blackout.periods.some(period => {
        const isStartHalved = period.start.split(":")[1] === "30";
        const isEndHalved = period.end.split(":")[1] === "30";

        return isStartHalved || isEndHalved;
      });
    })

    const startHour = this.startingTime.hour;
    const endHour = this.endingTime.hour;

    for (let i = startHour; i < endHour; i++) {
      labels.push(`${i}:00`);
      if (isHalvesPresent && i !== endHour - 1) {
        labels.push(`${i}:30`);
      }
    }

    this.labels = labels;
    return labels;
  }
}