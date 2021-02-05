import { useState } from "react";

const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return () => setIt((it) => !it);
};

export default useForceUpdate;
