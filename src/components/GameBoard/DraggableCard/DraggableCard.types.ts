import { State } from 'react-dragtastic';
import { ICard, RobbingType } from '../../../game';

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

export interface IDraggableCardData {
  sourceCard: ICard;
  sourceCardIndex: number;
  sourcePlayerId: string;
  sourceCardLocation: RobbingType;
}
