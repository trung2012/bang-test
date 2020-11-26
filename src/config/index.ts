const { protocol, hostname, port } = window.location;
export const SERVER_URL = `${protocol}//${hostname}:${port}` || 'http://localhost:8000';
