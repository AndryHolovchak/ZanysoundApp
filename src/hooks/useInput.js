import React, { useState } from "react";

const useInput = (initValue) => {
  const [value, setValue] = useState(initValue);

  return [
    value,
    setValue,
    {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  ];
};
export default useInput;
