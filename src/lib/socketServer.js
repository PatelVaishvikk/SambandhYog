const globalForSocket = globalThis;

function ensureStore() {
  if (!globalForSocket.__socketServerStore) {
    globalForSocket.__socketServerStore = { io: null };
  }
  return globalForSocket.__socketServerStore;
}

export function setSocketServer(io) {
  const store = ensureStore();
  store.io = io;
}

export function getSocketServer() {
  const store = ensureStore();
  return store.io;
}
