import { ipcMain, net, shell } from "electron";
import { config } from "./config";
import { connectToServer, currentServerUrl, loadLauncher } from "./window";

export function initLauncherIpc() {
  ipcMain.handle("launcher:get-config", async () => {
    return {
      savedServers: config.savedServers || [],
      lastServerUrl: config.lastServerUrl || "https://stoat.chat/app",
      autoConnect: config.autoConnect || false,
      currentServerUrl: currentServerUrl,
      officialUrl: "https://stoat.chat/app",
    };
  });

  ipcMain.handle("launcher:connect", async (_, data: { url: string; remember?: boolean; name?: string }) => {
    connectToServer(data.url, {
      remember: data.remember,
      name: data.name,
    });
    return true;
  });

  ipcMain.handle("launcher:open-launcher", async () => {
    loadLauncher();
    return true;
  });

  ipcMain.handle("launcher:save-server", async (_, server: { id?: string; name: string; url: string }) => {
    let url = server.url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const servers = [...config.savedServers];
    const id = server.id || "srv-" + Date.now();
    const existingIndex = servers.findIndex((s) => s.id === id || s.url.replace(/\/+$/, "").toLowerCase() === url.replace(/\/+$/, "").toLowerCase());

    if (existingIndex >= 0) {
      servers[existingIndex] = {
        ...servers[existingIndex],
        name: server.name || servers[existingIndex].name,
        url: url,
        lastUsed: Date.now(),
      };
    } else {
      servers.push({
        id: id,
        name: server.name || new URL(url).hostname,
        url: url,
        lastUsed: Date.now(),
      });
    }

    config.savedServers = servers;
    return servers;
  });

  ipcMain.handle("launcher:delete-server", async (_, id: string) => {
    const servers = (config.savedServers || []).filter((s) => s.id !== id);
    config.savedServers = servers;
    return servers;
  });

  ipcMain.handle("launcher:test-server", async (_, rawUrl: string) => {
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    try {
      const parsed = new URL(url);
      const startTime = Date.now();
      
      return new Promise<{ ok: boolean; latency: number; error?: string }>((resolve) => {
        const req = net.request({
          method: "GET",
          url: parsed.toString(),
        });

        const timer = setTimeout(() => {
          try { req.abort(); } catch {}
          resolve({ ok: false, latency: 0, error: "Connection timed out (5s)" });
        }, 5000);

        req.on("response", (res) => {
          clearTimeout(timer);
          const latency = Date.now() - startTime;
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 500,
            latency,
          });
        });

        req.on("error", (err) => {
          clearTimeout(timer);
          resolve({
            ok: false,
            latency: 0,
            error: err.message || "Failed to reach server",
          });
        });

        req.end();
      });
    } catch (e: any) {
      return { ok: false, latency: 0, error: e?.message || "Invalid URL" };
    }
  });

  ipcMain.handle("launcher:set-auto-connect", async (_, enabled: boolean) => {
    config.autoConnect = enabled;
    return config.autoConnect;
  });

  ipcMain.handle("launcher:open-external", async (_, url: string) => {
    shell.openExternal(url);
  });
}
