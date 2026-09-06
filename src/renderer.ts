import "./index.css";

declare global {
  interface Window {
    native?: {
      minimise: () => void;
      maximise: () => void;
      close: () => void;
    };
    launcherApi?: {
      getConfig: () => Promise<{
        savedServers: Array<{ id: string; name: string; url: string; lastUsed?: number }>;
        lastServerUrl: string;
        autoConnect: boolean;
        officialUrl: string;
      }>;
      connect: (data: { url: string; remember?: boolean; name?: string }) => Promise<boolean>;
      saveServer: (server: { id?: string; name?: string; url: string }) => Promise<any>;
      deleteServer: (id: string) => Promise<any>;
      testServer: (url: string) => Promise<{ ok: boolean; latency: number; error?: string }>;
      setAutoConnect: (enabled: boolean) => Promise<boolean>;
      openExternal: (url: string) => Promise<void>;
    };
  }
}

// Window control buttons
document.getElementById("btn-minimize")?.addEventListener("click", () => {
  window.native?.minimise();
});

document.getElementById("btn-maximize")?.addEventListener("click", () => {
  window.native?.maximise();
});

document.getElementById("btn-close")?.addEventListener("click", () => {
  window.native?.close();
});

// Elements
const btnConnectOfficial = document.getElementById("btn-connect-official") as HTMLButtonElement;
const customForm = document.getElementById("custom-server-form") as HTMLFormElement;
const serverUrlInput = document.getElementById("server-url") as HTMLInputElement;
const serverNameInput = document.getElementById("server-name") as HTMLInputElement;
const chkAutoConnect = document.getElementById("chk-auto-connect") as HTMLInputElement;
const btnTestServer = document.getElementById("btn-test-server") as HTMLButtonElement;
const btnSaveServer = document.getElementById("btn-save-server") as HTMLButtonElement;
const btnConnectCustom = document.getElementById("btn-connect-custom") as HTMLButtonElement;
const testResult = document.getElementById("test-result") as HTMLDivElement;
const savedList = document.getElementById("saved-servers-list") as HTMLDivElement;

const linkGithub = document.getElementById("link-github");
const linkDocs = document.getElementById("link-docs");

linkGithub?.addEventListener("click", (e) => {
  e.preventDefault();
  window.launcherApi?.openExternal("https://github.com/stoatchat/for-desktop");
});

linkDocs?.addEventListener("click", (e) => {
  e.preventDefault();
  window.launcherApi?.openExternal("https://github.com/stoatchat/self-hosted");
});

// Render saved servers
function renderSavedServers(servers: Array<{ id: string; name: string; url: string; lastUsed?: number }>) {
  if (!savedList) return;
  savedList.innerHTML = "";

  if (!servers || servers.length === 0) {
    savedList.innerHTML = '<div class="empty-state">No custom saved servers. Enter an address above to save one.</div>';
    return;
  }

  servers.forEach((srv) => {
    const item = document.createElement("div");
    item.className = "saved-item";

    const info = document.createElement("div");
    info.className = "saved-info";

    const name = document.createElement("div");
    name.className = "saved-name";
    name.textContent = srv.name || srv.url;

    const url = document.createElement("div");
    url.className = "saved-url";
    url.textContent = srv.url;

    info.appendChild(name);
    info.appendChild(url);

    const actions = document.createElement("div");
    actions.className = "saved-item-actions";

    const connectBtn = document.createElement("button");
    connectBtn.className = "btn btn-secondary btn-sm";
    connectBtn.textContent = "Connect";
    connectBtn.addEventListener("click", () => {
      window.launcherApi?.connect({ url: srv.url, remember: true, name: srv.name });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger-sm btn-sm";
    deleteBtn.title = "Delete server";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const updated = await window.launcherApi?.deleteServer(srv.id);
      renderSavedServers(updated);
    });

    actions.appendChild(connectBtn);
    // Don't allow deleting official entry if present
    if (srv.id !== "official") {
      actions.appendChild(deleteBtn);
    }

    item.appendChild(info);
    item.appendChild(actions);

    savedList.appendChild(item);
  });
}

// Initialize launcher data
async function init() {
  if (!window.launcherApi) {
    console.warn("launcherApi not available in window");
    return;
  }

  try {
    const cfg = await window.launcherApi.getConfig();
    if (cfg) {
      if (cfg.savedServers) {
        renderSavedServers(cfg.savedServers);
      }
      if (cfg.autoConnect !== undefined) {
        chkAutoConnect.checked = cfg.autoConnect;
      }
      if (cfg.lastServerUrl && cfg.lastServerUrl !== cfg.officialUrl) {
        serverUrlInput.value = cfg.lastServerUrl;
      }
    }
  } catch (err) {
    console.error("Failed to load launcher configuration:", err);
  }
}

// Connect to Official Server
btnConnectOfficial?.addEventListener("click", () => {
  window.launcherApi?.connect({
    url: "https://stoat.chat/app",
    remember: chkAutoConnect?.checked ?? false,
    name: "Official Stoat Server",
  });
});

// Auto-connect toggle change
chkAutoConnect?.addEventListener("change", () => {
  window.launcherApi?.setAutoConnect(chkAutoConnect.checked);
});

// Test Server Reachability
btnTestServer?.addEventListener("click", async () => {
  const url = serverUrlInput.value.trim();
  if (!url) {
    testResult.className = "test-result error";
    testResult.textContent = "Please enter a server URL first.";
    return;
  }

  testResult.className = "test-result testing";
  testResult.textContent = "Testing connection to server...";

  try {
    const res = await window.launcherApi?.testServer(url);
    if (res?.ok) {
      testResult.className = "test-result success";
      testResult.textContent = `Connected successfully! (Latency: ${res.latency}ms)`;
    } else {
      testResult.className = "test-result error";
      testResult.textContent = res?.error ? `Connection failed: ${res.error}` : "Connection failed. Server unreachable.";
    }
  } catch (err: any) {
    testResult.className = "test-result error";
    testResult.textContent = `Error testing server: ${err?.message || err}`;
  }
});

// Save to favorites
btnSaveServer?.addEventListener("click", async () => {
  const url = serverUrlInput.value.trim();
  if (!url) {
    testResult.className = "test-result error";
    testResult.textContent = "Please enter a server URL to save.";
    return;
  }

  const name = serverNameInput.value.trim() || undefined;
  const updated = await window.launcherApi?.saveServer({ url, name });
  renderSavedServers(updated);

  testResult.className = "test-result success";
  testResult.textContent = "Server saved to favorites!";
});

// Custom Server form submit
customForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = serverUrlInput.value.trim();
  if (!url) return;

  const name = serverNameInput.value.trim() || undefined;
  const remember = chkAutoConnect.checked;

  window.launcherApi?.connect({
    url,
    name,
    remember,
  });
});

init();
