export type RawNewsContent = {
  id: number;
  date: string;
  localTime: string;
  fileMainImage: string;
  title: string;
  htmlBody: string;
  description: string;
  url: string;
  isEnabled: boolean;
  isPublished: boolean;
  fileList: Record<string, any>[];
  categoryName: string;
  categoryURL: string;
  time: string | null;
  newTime: string | null;
}