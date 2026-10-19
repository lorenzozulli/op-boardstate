import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';
import type { CardId } from '../../../types';
import { vibrate } from '../../../utils/vibrate';

const DRAG_START_THRESHOLD = 8;
const AUTO_SCROLL_EDGE = 48;
const AUTO_SCROLL_MAX_SPEED = 12;
const SLIDE_DURATION_MS = 180;

interface DragGesture {
  pointerId: number;
  id: CardId;
  initialOrder: CardId[];
  order: CardId[];
  startClientX: number;
  clientX: number;
  startScrollLeft: number;
  startOffsetLeft: number;
  started: boolean;
  slotLefts: number[];
  containerBounds: DOMRect | null;
  draggedLeft: number;
}

interface CharacterDragOptions {
  chars: CardId[];
  container: RefObject<HTMLDivElement | null>;
  onReorder: (order: CardId[]) => void;
}

const moveTo = (order: CardId[], id: CardId, index: number): CardId[] => {
  const others = order.filter((other) => other !== id);
  return [...others.slice(0, index), id, ...others.slice(index)];
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const nearestSlotIndex =(slotLefts: number[], left: number) =>
  slotLefts.reduce(
    (nearest, slotLeft, index) => (Math.abs(slotLeft - left) < Math.abs(slotLefts[nearest] - left) ? index : nearest),
    0,
  );

const autoScrollSpeed = (bounds: DOMRect, clientX: number) => {
  const leftEdgeDepth = AUTO_SCROLL_EDGE - (clientX - bounds.left);
  const rightEdgeDepth = AUTO_SCROLL_EDGE - (bounds.right - clientX);
  if (leftEdgeDepth > 0) return -AUTO_SCROLL_MAX_SPEED * Math.min(1, leftEdgeDepth / AUTO_SCROLL_EDGE);
  if (rightEdgeDepth > 0) return AUTO_SCROLL_MAX_SPEED * Math.min(1, rightEdgeDepth / AUTO_SCROLL_EDGE);
  return 0;
};

const slideFrom = (element: HTMLElement, offset: number) =>
  element.animate([{ transform: `translateX(${offset}px)` }, { transform: 'none' }], {
    duration: SLIDE_DURATION_MS,
    easing: 'ease-out',
  });

export function useCharacterDrag({ chars, container, onReorder }: CharacterDragOptions) {
  const [draggingId, setDraggingId] = useState<CardId | null>(null);
  const gesture = useRef<DragGesture | null>(null);
  const columnElements = useRef(new Map<CardId, HTMLElement>());
  const positionsBeforeDrop = useRef<Map<CardId, number> | null>(null);
  const followFrame = useRef(0);

  const containerScrollLeft = () => container.current?.scrollLeft ?? 0;

  const pointerDraggedLeft = (drag: DragGesture) => {
    const unboundedLeft =
      drag.startOffsetLeft + drag.clientX - drag.startClientX + containerScrollLeft() - drag.startScrollLeft;
    return clamp(unboundedLeft, drag.slotLefts[0], drag.slotLefts[drag.slotLefts.length - 1]);
  };

  const shiftColumn = (id: CardId, offset: number) => {
    const element = columnElements.current.get(id);
    if (element) element.style.transform = `translateX(${offset}px)`;
  };

  const shiftColumnsToPreviewOrder = (drag: DragGesture) =>
    drag.order.forEach((id, index) => {
      if (id !== drag.id) shiftColumn(id, drag.slotLefts[index] - drag.slotLefts[drag.initialOrder.indexOf(id)]);
    });

  const moveDraggedToNearestSlot = (drag: DragGesture) => {
    const targetIndex = nearestSlotIndex(drag.slotLefts, drag.draggedLeft);
    if (drag.order[targetIndex] === drag.id) return;
    drag.order = moveTo(drag.order, drag.id, targetIndex);
    shiftColumnsToPreviewOrder(drag);
    vibrate(8);
  };

  const autoScroll = (drag: DragGesture) => {
    const speed = drag.containerBounds ? autoScrollSpeed(drag.containerBounds, drag.clientX) : 0;
    if (speed) container.current?.scrollBy(speed, 0);
  };

  const followPointer = () => {
    const drag = gesture.current;
    if (!drag) return;
    autoScroll(drag);
    const draggedLeft = pointerDraggedLeft(drag);
    if (draggedLeft !== drag.draggedLeft) {
      drag.draggedLeft = draggedLeft;
      shiftColumn(drag.id, draggedLeft - drag.startOffsetLeft);
      moveDraggedToNearestSlot(drag);
    }
    followFrame.current = requestAnimationFrame(followPointer);
  };

  const startDrag = (drag: DragGesture) => {
    drag.started = true;
    drag.slotLefts = drag.initialOrder.map((id) => columnElements.current.get(id)?.offsetLeft ?? 0);
    drag.containerBounds = container.current?.getBoundingClientRect() ?? null;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setDraggingId(drag.id);
    vibrate(10);
    followFrame.current = requestAnimationFrame(followPointer);
  };

  const capturePositionsBeforeDrop = () => {
    positionsBeforeDrop.current = new Map(
      [...columnElements.current].map(([id, element]) => [id, element.getBoundingClientRect().left]),
    );
  };

  const endDrag = (commit: boolean) => {
    const drag = gesture.current;
    gesture.current = null;
    if (!drag?.started) return;
    cancelAnimationFrame(followFrame.current);
    capturePositionsBeforeDrop();
    columnElements.current.forEach((element) => element.style.removeProperty('transform'));
    setDraggingId(null);
    if (commit) onReorder(drag.order);
  };

  const slideColumnsIntoPlace = useEffectEvent(() => {
    const previousPositions = positionsBeforeDrop.current;
    positionsBeforeDrop.current = null;
    previousPositions?.forEach((previousLeft, id) => {
      const element = columnElements.current.get(id);
      if (!element) return;
      element.getAnimations().forEach((animation) => animation.cancel());
      const offset = previousLeft - element.getBoundingClientRect().left;
      if (offset) slideFrom(element, offset);
    });
  });

  useLayoutEffect(() => {
    slideColumnsIntoPlace();
  }, [chars, draggingId]);

  useEffect(() => {
    const frame = followFrame;
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const registerColumn = (id: CardId) => (element: HTMLDivElement) => {
    columnElements.current.set(id, element);
    return () => {
      columnElements.current.delete(id);
    };
  };

  const handleHandlers = (id: CardId) => ({
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      const element = columnElements.current.get(id);
      if (gesture.current || !element || event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      gesture.current = {
        pointerId: event.pointerId,
        id,
        initialOrder: chars,
        order: chars,
        startClientX: event.clientX,
        clientX: event.clientX,
        startScrollLeft: containerScrollLeft(),
        startOffsetLeft: element.offsetLeft,
        started: false,
        slotLefts: [],
        containerBounds: null,
        draggedLeft: element.offsetLeft,
      };
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      const drag = gesture.current;
      if (drag?.pointerId !== event.pointerId) return;
      drag.clientX = event.clientX;
      if (!drag.started && Math.abs(drag.clientX - drag.startClientX) > DRAG_START_THRESHOLD) startDrag(drag);
    },
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
      if (gesture.current?.pointerId === event.pointerId) endDrag(true);
    },
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => {
      if (gesture.current?.pointerId === event.pointerId) endDrag(false);
    },
  });

  const isDragging = (id: CardId) => draggingId === id;

  return {
    isReordering: draggingId !== null,
    isDragging,
    registerColumn,
    handleHandlers,
  };
}

export type CharacterDrag = ReturnType<typeof useCharacterDrag>;
