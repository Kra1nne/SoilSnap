import { useEffect, useState } from "react";

export default function OfflineProgress() {
  const [status, setStatus] = useState<{ type?: string; index?: number; total?: number; url?: string; ok?: boolean; err?: any } | null>(null);

  useEffect(() => {
    const handler = (e: any) => setStatus(e.detail);
    window.addEventListener("sw-status", handler as EventListener);
    return () => window.removeEventListener("sw-status", handler as EventListener);
  }, []);

  if (!status) return null;

  if (status.type === "SW_INSTALL_PROGRESS") {
    const pct = Math.round(((status.index || 0) / (status.total || 1)) * 100);
    return (
      <div style={{ position: "fixed", bottom: 8, left: 8, right: 8, zIndex: 9999 }}>
        <div style={{ background: "#eee", height: 8, borderRadius: 4 }}>
          <div style={{ width: `${pct}%`, height: 8, background: "#4caf50", borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 12, color: "#333", marginTop: 6 }}>
          Caching app shell: {status.index}/{status.total} {status.ok === false ? "(failed)" : ""} {status.url ? `- ${status.url}` : ""}
        </div>
      </div>
    );
  }

  if (status.type === "SW_SYNC_PROGRESS" || status.type === "SW_SYNC_START") {
    const pct = status.total ? Math.round(((status.index || 0) / status.total) * 100) : 0;
    return (
      <div style={{ position: "fixed", bottom: 8, left: 8, right: 8, zIndex: 9999 }}>
        <div style={{ background: "#eee", height: 8, borderRadius: 4 }}>
          <div style={{ width: `${pct}%`, height: 8, background: "#2196f3", borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 12, color: "#333", marginTop: 6 }}>
          Syncing offline queue: {status.index || 0}/{status.total || 0} {status.err ? `- ${status.err}` : ""}
        </div>
      </div>
    );
  }

  if (status.type === "SW_SYNC_DONE") {
    return <div style={{ position: "fixed", bottom: 8, left: 8, zIndex: 9999, background: "#0f0", padding: 6 }}>Offline sync done</div>;
  }

  if (status.type === "SW_SYNC_ERROR") {
    return <div style={{ position: "fixed", bottom: 8, left: 8, zIndex: 9999, background: "#ffcc00", padding: 6 }}>Sync error: {String(status.err)}</div>;
  }

  return null;
}