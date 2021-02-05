import React, { useState, useEffect, useRef } from "react";

const useActive = (ref = {}) => {
  const [value, setValue] = useState(false);
  const handleMouseDown = (e) => {
    setValue(true);
  };
  const handleMouseUp = () => setValue(false);
  useEffect(
    () => {
      const node = ref && ref.current;
      if (node) {
        node.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
          node.removeEventListener("mousedown", handleMouseDown);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    },
    [ref, ref.current] // Recall only if ref changes
  );

  return [value];
};

export default useActive;
