import React, { useState, useEffect, useRef } from "react";

const useHover = (ref = {}) => {
  const [value, setValue] = useState(false);
  const handleMouseOver = (e) => setValue(true); //setValue(e.target == ref.current);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);

        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [value];
};

export default useHover;
