import { State } from 'react-dragtastic';

export type IDraggableDragState = State & {
  isActive: boolean;
  events: {
    onMouseDown: (event: React.MouseEvent<Element, MouseEvent>) => void;
    onTouchStart: (event: React.TouchEvent<Element>) => void;
  };
};

export type IDragComponentDragState = State & {
  isOverAccepted: boolean;
};

export type IDroppableDragState = State & {
  isOver: boolean;
  willAccept: boolean;
  events: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseUp: () => void;
  };
};
