import Bang from './src/game';
import { Server } from 'boardgame.io/server';

const server = Server({ games: [Bang] });

server.run(8000);
