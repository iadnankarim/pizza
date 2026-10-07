"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true only on the client after hydration – avoids SSR mismatch with persisted stores */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
