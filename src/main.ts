import { IUpdateInfo, updateElectronApp } from "update-electron-app";

import { BrowserWindow, Notification, app, globalShortcut, shell } from "electron";
import started from "electron-squirrel-startup";

import { initAutoLaunch } from "./native/autoLaunch";
import { config } from "./native/config";
import { initDiscordRpc } from "./native/discordRpc";
import { initTray } from "./native/tray";
import { initVirtualMic } from "./native/virtualMic";
import {
  createMainWindow,
  isAllowedNavigation,
  loadLauncher,
  mainWindow,
} from "./native/window";

// Squirrel-specific logic
// create/remove shortcuts on Windows when installing / uninstalling
// we just need to close out of the app immediately
if (started) {
  app.quit();
}

// disable hw-accel if so requested
if (!config.hardwareAcceleration) {
  app.disableHardwareAcceleration();
}

// ensure only one copy of the application can run
const acquiredLock = app.requestSingleInstanceLock();

const onNotifyUser = (_info: IUpdateInfo) => {
  const notification = new Notification({
    title: "Update Available",
    body: "Restart the app to install the update.",
    silent: true,
  });

  notification.show();
};

if (acquiredLock) {
  // start auto update logic
  updateElectronApp({ onNotifyUser });

  // create and configure the app when electron is ready
  app.on("ready", () => {
    // create window and application contexts
    createMainWindow();

    // save first launch state
    if (config.firstLaunch) {
      // Doesn't do anything right now. Used to enable auto start, but that behaviour was removed.
      // Left in case it gets used in the future.
      config.firstLaunch = false;
    }

    initTray();
    initDiscordRpc();
    initVirtualMic();
    initAutoLaunch();

    // Windows specific fix for notifications
    if (process.platform === "win32") {
      app.setAppUserModelId("chat.stoat.notifications");
    }

    // Register global shortcut to return to Open Stoat Launcher
    globalShortcut.register("CommandOrControl+Alt+S", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.restore();
        mainWindow.focus();
        loadLauncher();
      }
    });
  });

  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });

  // focus the window if we try to launch again
  app.on("second-instance", () => {
    mainWindow.show();
    mainWindow.restore();
    mainWindow.focus();
  });

  // macOS specific behaviour to keep app active in dock:
  // (irrespective of the minimise-to-tray option)

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // ensure URLs launch in external context
  app.on("web-contents-created", (_, contents) => {
    // prevent navigation out of allowed origins (launcher or current server)
    contents.on("will-navigate", (event, navigationUrl) => {
      if (!isAllowedNavigation(navigationUrl)) {
        event.preventDefault();
        if (
          navigationUrl.startsWith("http:") ||
          navigationUrl.startsWith("https:")
        ) {
          shell.openExternal(navigationUrl);
        }
      }
    });

    // handle links externally
    contents.setWindowOpenHandler(({ url }) => {
      if (
        url.startsWith("http:") ||
        url.startsWith("https:") ||
        url.startsWith("mailto:")
      ) {
        setImmediate(() => {
          shell.openExternal(url);
        });
      }

      return { action: "deny" };
    });
  });
} else {
  app.quit();
}
