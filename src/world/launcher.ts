import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("launcherApi", {
  getConfig: () => ipcRenderer.invoke("launcher:get-config"),
  connect: (data: { url: string; remember?: boolean; name?: string }) =>
    ipcRenderer.invoke("launcher:connect", data),
  saveServer: (server: { id?: string; name: string; url: string }) =>
    ipcRenderer.invoke("launcher:save-server", server),
  deleteServer: (id: string) =>
    ipcRenderer.invoke("launcher:delete-server", id),
  testServer: (url: string) => ipcRenderer.invoke("launcher:test-server", url),
  setAutoConnect: (enabled: boolean) =>
    ipcRenderer.invoke("launcher:set-auto-connect", enabled),
  openExternal: (url: string) =>
    ipcRenderer.invoke("launcher:open-external", url),
});
