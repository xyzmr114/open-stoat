declare type SavedServer = {
  id: string;
  name: string;
  url: string;
  lastUsed?: number;
};

declare type DesktopConfig = {
  firstLaunch: boolean;
  customFrame: boolean;
  minimiseToTray: boolean;
  startMinimisedToTray?: boolean;
  spellchecker: boolean;
  hardwareAcceleration: boolean;
  discordRpc: boolean;
  autoConnect: boolean;
  lastServerUrl?: string;
  savedServers: SavedServer[];
  windowState: {
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximised: boolean;
  };
};
