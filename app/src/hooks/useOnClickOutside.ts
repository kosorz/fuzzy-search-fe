import { RefObject, useEffect } from "react";

export const useOnClickOutside = ({
  ref,
  onClickOutside,
}: {
  ref: RefObject<HTMLDivElement | null>;
  onClickOutside: () => void;
}) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
};
