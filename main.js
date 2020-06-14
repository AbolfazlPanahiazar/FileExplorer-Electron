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

/////////////////////////////////////////
//////////// IPCs response //////////////
/////////////////////////////////////////
const _map = [];

ipcMain.on("get files", (event, data) => {
  // If it's in the root and want to return back
  if (data == "Close") {
    app.quit();
  }
  // Read file and response the inner files
  else if (data == _map[_map.length - 1]) {
    _map.pop();
    let _path = _map.join("/");
    fs.readdir(_path, (err, files) => {
      const response = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const obj = {};
          obj.name = files[i];
          let state = fs.statSync(`${_path}/${files[i]}`);
          if (state.isDirectory()) {
            obj.type = "folder";
          } else {
            obj.type = "file";
          }
          response.push(obj);
        } catch (er) {
          console.log(er);
        }
      }
      event.returnValue = response;
    });
  } else {
    _map.push(data);
    let _path = _map.join("/");

    fs.readdir(_path, (err, files) => {
      const response = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const obj = {};
          obj.name = files[i];
          let state = fs.statSync(`${_path}/${files[i]}`);
          if (state.isDirectory()) {
            obj.type = "folder";
          } else {
            obj.type = "file";
          }
          response.push(obj);
        } catch (er) {
          console.log(er);
        }
      }
      event.returnValue = response;
    });
  }
});
