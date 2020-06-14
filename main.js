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
  if (data == "root") {
    app.quit();
  }

  // Back request
  else if (data == _map[_map.length - 1]) {
    _map.pop();

    // Back to root
    if (_map.length == 0) {
      const obj1 = {
        parent: "root",
        grandParent: "Close",
        name: "C:/",
        type: "folder",
      };
      const obj2 = {
        parent: "root",
        grandParent: "Close",
        name: "D:/",
        type: "folder",
      };
      const obj3 = {
        parent: "root",
        grandParent: "Close",
        name: "E:/",
        type: "folder",
      };
      const response = [obj1, obj2, obj3];
      event.returnValue = response;
    }

    // Just Back
    else {
      let _path = _map.join("/");
      fs.readdir(_path, (err, files) => {
        const response = [];
        for (let i = 0; i < files.length; i++) {
          try {
            const obj = {};
            obj.name = files[i];
            obj.parent = _map[_map.length - 1];
            obj.grandParent = _map[_map.length - 2];
            if (obj.grandParent == undefined) {
              obj.grandParent = "root";
            }
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
  }

  // non-back request
  else {
    _map.push(data);
    let _path = _map.join("/");

    fs.readdir(_path, (err, files) => {
      const response = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const obj = {};
          obj.name = files[i];
          obj.parent = _map[_map.length - 1];
          obj.grandParent = _map[_map.length - 2];
          if (obj.grandParent == undefined) {
            obj.grandParent = "root";
          }
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
