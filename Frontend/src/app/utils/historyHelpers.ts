import { Prompt } from "@/types/history";

interface FetchHistoryResponse {
  data: Prompt[];
  hasMore: boolean;
}

export default function fetchMockHistory(
  allData: Prompt[],
  offset: number,
  limit: number = 3
): FetchHistoryResponse {
  const getTime = (t: any) => {
  if (!t) return 0;

  // Firestore Timestamp object
  if (typeof t === "object" && "seconds" in t) {
    return t.seconds * 1000;
  }

  // ISO string or Date
  return new Date(t).getTime();
};

const sorted = [...allData].sort(
  (a, b) => getTime(b.updated_at) - getTime(a.updated_at)
);

  const paginatedData = sorted.slice(offset, offset + limit);
  const hasMore = offset + limit < sorted.length;

  return { data: paginatedData, hasMore };
}