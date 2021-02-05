import React, { useState, useEffect } from "react";
import { isWindowWidthWithin } from "../utils/deviceUtils";

const useAdaptiveRender = (minWindowWidth, maxWindowWidth) => {
  const [isCanBeRendered, setIsCanBeRendered] = useState(
    isWindowWidthWithin(minWindowWidth, maxWindowWidth)
  );

  const handleWindowResize = () => {
    if (isCanBeRendered ^ isWindowWidthWithin(minWindowWidth, maxWindowWidth)) {
      setIsCanBeRendered(!isCanBeRendered);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  });

  return isCanBeRendered;
};

export default useAdaptiveRender;
