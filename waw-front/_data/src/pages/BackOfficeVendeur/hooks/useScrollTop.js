import { useEffect, useState } from "react";

const getScrollTop = () => {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};

const useScrollTop = (scroll = getScrollTop()) => {
  const [positionState, setPositionState] = useState(scroll);

  function handleScrollChange() {
    setPositionState(getScrollTop());
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScrollChange);

    return function cleanup() {
      window.removeEventListener("scroll", handleScrollChange);
    };
  }, []);

  return {
    position: positionState
  };
};

export default useScrollTop;
