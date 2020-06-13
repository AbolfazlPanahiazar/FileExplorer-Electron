const { ipcRenderer } = require("electron");

// Add eventlistener on click
const items = document.getElementsByClassName("item");
Array.prototype.forEach.call(items, function (item) {
  item.addEventListener("click", function () {
    const newFiles = ipcRenderer.sendSync("get files", item.children[1].innerText);
    console.log(newFiles);
  });
});
