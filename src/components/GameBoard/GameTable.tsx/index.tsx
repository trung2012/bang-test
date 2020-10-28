import React, { Fragment, useContext } from 'react';
import { DragComponent, Draggable, Droppable } from 'react-dragtastic';
import { GameContext } from '../../../context';
import './GameTable.scss';

export const GameTable = () => {
  const { G, playersInfo } = useContext(GameContext);
  const { players } = G;

  const onDrop = (data: any) => {
    console.log(data);
  };

  if (playersInfo && playersInfo.length > 0) {
    return (
      <div className='players'>
        {playersInfo.map(p => {
          const player = players[p.id];

          return (
            player && (
              <Fragment key={player.id}>
                <div className='player'>
                  <Droppable accepts='card' onDrop={onDrop}>
                    {dragState => (
                      <div className='player-info' {...dragState.events}>
                        <div>{p.name}</div>
                        <div>{player.character.name}</div>
                        <div>{player.hp}</div>
                        <div>{player.isDead ? 'Dead' : 'Alive'}</div>
                      </div>
                    )}
                  </Droppable>
                  <div className='player-cards'>
                    {player.hand.map(card => (
                      <Fragment key={card.id}>
                        <Draggable id={`${card.id}`} type='card' data={{ cardID: card.id }}>
                          {dragState => (
                            <div
                              className='card'
                              {...dragState.events}
                              style={{
                                display:
                                  dragState.isDragging && dragState.currentlyDraggingId === card.id
                                    ? 'none'
                                    : 'block',
                              }}
                            >
                              <img src={card.imageUrl} alt='card' />
                            </div>
                          )}
                        </Draggable>
                        <DragComponent for={`${card.id}`}>
                          {dragState => (
                            <div
                              className='card-dragging'
                              style={{
                                position: 'fixed',
                                left: dragState.x - 40,
                                top: dragState.y - 40,
                              }}
                            >
                              <img src={card.imageUrl} alt='card' />
                            </div>
                          )}
                        </DragComponent>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            )
          );
        })}
      </div>
    );
  }

  return <h1>Something went wrong</h1>;
};
