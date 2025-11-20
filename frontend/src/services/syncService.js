import { addPending, getAllPending, deletePending } from "../lib/offline-db";

async function sendToServer(op) {
  const init = {
    method: op.method || "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(op.body || {})
  };
  const resp = await fetch(op.url, init);
  if (!resp.ok) throw new Error("Server rejected");
  return resp.json();
}

export async function saveOrQueue(op) {
  // op: { method, url, body, meta }
  if (navigator.onLine) {
    try {
      await sendToServer(op);
      return { synced: true };
    } catch (e) {
      // fallthrough to queue
    }
  }
  await addPending({ op, createdAt: Date.now() });
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const reg = await navigator.serviceWorker.ready;
    try {
      await reg.sync.register("soil-snap-sync");
    } catch (e) {
      // ignore; fallback to 'online' event
    }
  } else {
    // try immediate processing via message to SW
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) reg.active.postMessage({ type: "PROCESS_QUEUE" });
    }
  }
  return { queued: true };
}

export async function flushQueueNow() {
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.ready;
    if (reg.active) reg.active.postMessage({ type: "PROCESS_QUEUE" });
    return;
  }
  // fallback: process locally
  const items = await getAllPending();
  for (const entry of items) {
    try {
      await sendToServer(entry.op);
      await deletePending(entry.id);
    } catch (err) {
      // stop on network error
      return;
    }
  }
}