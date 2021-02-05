import React, { useCallback } from "react";
import useEventListener from "./useEventListener";

const useStopPropagation = (eventName, ref = {}) => {
  const callback = useCallback((e) => {
    e.stopPropagation();
  }, []);
  const [a] = useEventListener(eventName, callback, ref);
  return [null];
};

export default useStopPropagation;
