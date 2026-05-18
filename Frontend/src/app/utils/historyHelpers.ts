import { Prompt } from "@/types/history";

interface FetchHistoryResponse {
  data: Prompt[];
  hasMore: boolean;
}

export default function fetchMockHistory(
  allData: Prompt[],
  offset: number,
  limit: number = 3,
): FetchHistoryResponse {
  const sorted = [...allData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const paginatedData = sorted.slice(offset, offset + limit);
  const hasMore = offset + limit < sorted.length;

  return { data: paginatedData, hasMore };
}
