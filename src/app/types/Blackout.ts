export type Blackout = {
  queue: string;
  periods: Array<{
    start: string;
    end: string;
  }>;
}