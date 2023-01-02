import * as React from "react";

export default function useForceRenderAfterMount() {
  let [num, setNum] = React.useState(0);
  React.useEffect(() => {
    setNum(++num);
  }, []);
}
