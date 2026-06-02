"use client";

import { useState, useEffect, useMemo } from "react";
import { Prompt } from "@/types/history";
import fetchMockHistory from "@/app/utils/historyHelpers";

export const useHistory = (initialData: Prompt[]) => {
  const [visiblePrompts, setVisiblePrompts] = useState<Prompt[]>([]);
  const [offset, setOffset] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  // ✅ stabilize incoming data
  const stableData = useMemo(() => initialData ?? [], [initialData]);

  useEffect(() => {
    const { data, hasMore: moreAvailable } =
      fetchMockHistory(stableData, 0);

    setVisiblePrompts(data);
    setOffset(3);
    setHasMore(moreAvailable);
  }, [stableData]);

  function loadMore() {
    const { data, hasMore: moreAvailable } =
      fetchMockHistory(stableData, offset);

    setVisiblePrompts((prev) => [...prev, ...data]);
    setOffset((prev) => prev + 3);
    setHasMore(moreAvailable);
  }

  return { visiblePrompts, setVisiblePrompts, loadMore, hasMore };
};