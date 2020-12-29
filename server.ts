import path from 'path';
import serve from 'koa-static';
import { Bang } from './src/game';
import { Server } from 'boardgame.io/server';

const server = Server({ games: [Bang] });

const PORT = Number(process.env.PORT) || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './build');
server.app.use(
  serve(frontEndAppBuildPath, {
    gzip: true,
  })
);

server.run(PORT, () => {
  server.app.use(
    async (ctx, next) =>
      await serve(frontEndAppBuildPath)(Object.assign(ctx, { path: 'index.html' }), next)
  );
});
