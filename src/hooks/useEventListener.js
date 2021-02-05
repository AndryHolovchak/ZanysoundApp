import React, { useState, useEffect, useRef } from "react";

const useEventListener = (eventName, callback, ref = {}) => {
  useEffect(
    () => {
      const node = ref && ref.current;
      if (node) {
        node.addEventListener(eventName, callback);
        return () => {
          node.removeEventListener(eventName, callback);
        };
      }
    },
    [ref, ref.current, callback] // Recall only if ref changes
  );
  return [null];
};

export default useEventListener;
