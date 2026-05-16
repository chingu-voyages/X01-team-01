"use client"

import { useState, useEffect } from "react";
import { Prompt } from "@/types/history";
import fetchMockHistory from "@/app/utils/historyHelpers";

export const useHistory = (initialData: Prompt[]) => {
  const [visiblePrompts, setVisiblePrompts] = useState<Prompt[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  //initial load
  useEffect(() => {
    const { data, hasMore: moreAvaliable } = fetchMockHistory(initialData, 0);
    setVisiblePrompts(data);
    (setOffset(3), setHasMore(moreAvaliable));
  }, [initialData]);

  function loadMore() {
    const { data, hasMore: moreAvaliable } = fetchMockHistory(
      initialData,
      offset,
    );

    setVisiblePrompts((prev) => [...prev, ...data]);
    setOffset((prev) => prev + 3);
    setHasMore(moreAvaliable);
  }

  return { visiblePrompts, setVisiblePrompts, loadMore, hasMore };
};
