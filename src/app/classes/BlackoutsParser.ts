import { Axios } from "axios";
import { DateTime } from "luxon";
import {Blackout, BlackoutNewsEntry, RawNewsContent} from "@/app/types";

export default class BlackoutsParser {
  blackoutsData: Array<Blackout> | null = null;
  fetchedBlackouts: Array<BlackoutNewsEntry> | null = null;

  private _labels: Array<string> | null = null;
  startingTime: DateTime | null = null;
  endingTime: DateTime | null = null;

  public get labels(): Array<string> {
    let labels: Array<string> = [];
    if (!this._labels) {
      labels = this.formLabels();
    }
    return this._labels || labels;
  }

  constructor(public targetUrl: string) {}

  private parseBlackoutNewsEntry(rawEntry: RawNewsContent): BlackoutNewsEntry {
    const obj: BlackoutNewsEntry = {
      dateTimePosted: '',
      dateTimeTarget: '',
      content: {
        id: 0,
        date: DateTime.now(),
        htmlBody: '',
      },
    };
    obj.dateTimePosted = DateTime.fromFormat(rawEntry.date, "dd.MM.yyyy HH:mm");

    const rawTargetTime = rawEntry.htmlBody.match(/(\d{1,2}\s[а-я]+\s\S+\s+\d{2}:\d{2})/gm);
    const targetTime = rawTargetTime ? DateTime.fromFormat(rawTargetTime[0], "dd MMMM 'з' HH:mm", { locale: 'uk-UA' }) : null;
    obj.dateTimeTarget = targetTime || '';

    obj.content = {
      id: rawEntry.id,
      date: DateTime.fromFormat(rawEntry.date, "dd.MM.yyyy HH:mm"),
      htmlBody: rawEntry.htmlBody,
    };

    return obj;
  }

  public async fetchBlackouts(): Promise<BlackoutNewsEntry[]> {
    const axios = new Axios();

    const res = await axios.get<string>(this.targetUrl)
      .then(response => response.data)
      .catch(e => {
        console.warn({e});
        return null;
      });

    const rawNews: RawNewsContent[] = JSON.parse(res || '');
    const newsWithBlackouts = rawNews.filter(entry => entry.htmlBody.includes("ГПВ"));
    const parsedBlackoutEntries: BlackoutNewsEntry[] = newsWithBlackouts.map((entry, index) => {
      const parsedEntry = this.parseBlackoutNewsEntry(entry);
      if (parsedEntry.dateTimeTarget == '') {
        const previous = this.parseBlackoutNewsEntry(newsWithBlackouts[index + 1]);
        parsedEntry.dateTimeTarget = previous.dateTimeTarget;
      }
      return parsedEntry;
    });

    this.fetchedBlackouts = parsedBlackoutEntries;
    return parsedBlackoutEntries || [];
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

  public formLabels(): Array<string> {
    if (!this.blackoutsData) return [];
    if (!this.startingTime || !this.endingTime) return [];

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

    console.log('BP', {labels})

    this._labels = labels;
    return labels;
  }
}