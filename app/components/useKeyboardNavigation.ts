import { useEffect } from "react";

export function useKeyboardNavigation({
  handlePageNavigation,
  onGoToFeed,
  onGoNext,
  onGoPrev,
}: any) {
  useEffect(() => {
    function handleKeys(event: any) {
      console.log(event.key);
      switch (event.key) {
        // Navigate
        case "ArrowDown":
        case "j":
          return onGoNext();

        case "ArrowUp":
        case "k":
          return onGoPrev();

        case "Escape":
          return onGoToFeed();

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
  }, [handlePageNavigation, onGoNext]);
}
