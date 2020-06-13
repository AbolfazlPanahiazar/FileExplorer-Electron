const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // Make it full screen
  win.maximize();

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

////////////////////////////////
//////////// IPCs response //////////////
////////////////////////////////
ipcMain.on("get files", (event, data) => {
  // If it's in the root and want to return back
  if (data == "Close") {
    app.quit();
  }
  // Read file and response the inner files
  else {
    fs.readdir(data, (err, files) => {
      event.returnValue = JSON.stringify(files);
    });
  }
});
