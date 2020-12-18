import styled from '@emotion/styled';
import { IDragComponentDragState, IDraggableDragState } from './DraggableCard.types';

export const DraggableCardContainer = styled.div<{
  draggableDragState: IDraggableDragState;
  cardId: string;
  index: number;
}>(props => ({
  display:
    props.draggableDragState.isDragging &&
    props.draggableDragState.currentlyDraggingId === props.cardId
      ? 'none'
      : 'block',
}));

export const DragComponentContainer = styled.div<{
  draggableDragState: IDragComponentDragState;
}>(
  {
    position: 'fixed',
    zIndex: 100,
    transform: 'translate(-50%, -50%)',
    cursor: 'grabbing',
  },
  ({ draggableDragState }) => ({
    left: draggableDragState.isDragging ? draggableDragState.x : draggableDragState.startingX,
    top: draggableDragState.isDragging ? draggableDragState.y : draggableDragState.startingY,
  })
);
