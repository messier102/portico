type Direction = "up" | "down" | "left" | "right";

export type SwipeEvent = CustomEvent<{ direction: Direction }>;

function swipeEvent(direction: Direction): SwipeEvent {
    return new CustomEvent("swipe", { detail: { direction } });
}

export function swipeable(node: HTMLElement): { destroy(): void } {
    let startX = 0;
    let startY = 0;

    function handleTouchStart(e: TouchEvent) {
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e: TouchEvent) {
        const diffX = e.changedTouches[0].screenX - startX;
        const diffY = e.changedTouches[0].screenY - startY;
        const ratioX = Math.abs(diffX / diffY);
        const ratioY = Math.abs(diffY / diffX);
        const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY);

        // Ignore small movements.
        if (absDiff < 30) {
            return;
        }

        if (ratioX > ratioY) {
            if (diffX >= 0) {
                node.dispatchEvent(swipeEvent("right"));
            } else {
                node.dispatchEvent(swipeEvent("left"));
            }
        } else {
            if (diffY >= 0) {
                node.dispatchEvent(swipeEvent("down"));
            } else {
                node.dispatchEvent(swipeEvent("up"));
            }
        }
    }

    node.addEventListener("touchstart", handleTouchStart);
    node.addEventListener("touchend", handleTouchEnd);

    return {
        destroy() {
            node.removeEventListener("touchstart", handleTouchStart);
            node.removeEventListener("touchend", handleTouchEnd);
        },
    };
}
