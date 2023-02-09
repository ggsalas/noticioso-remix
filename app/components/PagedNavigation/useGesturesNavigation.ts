import { useEffect } from "react";

const SWIPE_MAX_TIME = 500;
const SWIPE_MIN_DRAG = 70;

export function useGesturesNavigation({
  handlePageNavigation,
  onGoNext,
  toggleActions,
}: any) {
  useEffect(() => {
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;
    let timeStart = Date.now();
    let timeEnd = Date.now();

    function lastTouch(e: TouchEvent) {
      return e.changedTouches ? e.changedTouches[0] : null;
    }
    function touchStart(event: TouchEvent) {
      touchstartX = lastTouch(event)?.screenX ?? 0;
      touchstartY = lastTouch(event)?.screenY ?? 0;
      timeStart = Date.now();
    }
    function touchEnd(event: TouchEvent) {
      touchendX = lastTouch(event)?.screenX ?? 0;
      touchendY = lastTouch(event)?.screenY ?? 0;
      timeEnd = Date.now();
      handleGesure();
    }

    function handleGesure() {
      const deltaX = touchstartX - touchendX;
      const deltaY = touchstartY - touchendY;
      const deltaTime = timeEnd - timeStart;

      const shouldNotSwipe =
        Math.abs(deltaX) < SWIPE_MIN_DRAG && Math.abs(deltaY) < SWIPE_MIN_DRAG;
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      const leftDirection = deltaX > 0;
      const topDirection = deltaY > 0;

      if (deltaTime > SWIPE_MAX_TIME || shouldNotSwipe) {
        return;
      }
      if (isHorizontal && leftDirection) {
        return handlePageNavigation("next")();
      }
      if (isHorizontal && !leftDirection) {
        return handlePageNavigation("back")();
      }
      if (!isHorizontal && topDirection) {
        return onGoNext();
      }
      if (!isHorizontal && !topDirection) {
        return toggleActions();
      }
    }

    document?.addEventListener("touchstart", touchStart, false);
    document?.addEventListener("touchend", touchEnd, false);

    return () => {
      document.removeEventListener("touchstart", touchStart);
      document.removeEventListener("touchend", touchEnd);
    };
  }, [handlePageNavigation, onGoNext, toggleActions]);
}
