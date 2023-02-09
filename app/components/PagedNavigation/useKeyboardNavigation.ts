import { useEffect } from "react";

export function useKeyboardNavigation({
  handlePageNavigation,
  toggleActions,
  onGoToParent,
  onGoNext,
}: any) {
  useEffect(() => {
    function handleKeys(event: any) {
      switch (event.key) {
        // Navigate
        case "ArrowDown":
        case "j":
          return onGoNext();

        case "ArrowUp":
        case "k":
          return toggleActions();

        case "Escape":
          return onGoToParent();

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
