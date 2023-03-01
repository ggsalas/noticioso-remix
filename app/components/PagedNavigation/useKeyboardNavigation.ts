import { useEffect } from "react";

export function useKeyboardNavigation({
  handlePageNavigation,
  toggleActions,
  onGoToParent,
  onGoNext,
  onGoPrev,
}: any) {
  useEffect(() => {
    function handleKeys(event: any) {
      /**
       * esc   toggleActions
       *
       * ↑     onGoPrev
       * k
       *
       * ↓     onGoNext
       * j
       *
       * ←     handlePageNavigation(back)
       * h
       * del
       *
       * →     handlePageNavigation(back)
       * l
       * space
       *
       */

      switch (event.key) {
        // Navigate
        case "ArrowDown":
        case "j":
          return onGoNext();

        case "ArrowUp":
        case "k":
          return onGoPrev();

        case "Escape":
          return toggleActions();

        case "H":
          return onGoToParent && onGoToParent();

        // Scroll
        case "ArrowRight":
        case "l":
        case " ":
          return handlePageNavigation("next")();

        case "ArrowLeft":
        case "h":
        case "Backspace":
          return handlePageNavigation("back")();

        default:
          return;
      }
    }

    document.addEventListener("keydown", handleKeys);

    return () => {
      document.removeEventListener("keydown", handleKeys);
    };
  }, [handlePageNavigation, onGoNext, onGoToParent, toggleActions]);
}
