const { protocol, hostname, port } = window.location;
export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : `${protocol}//${hostname}:${port}`;
