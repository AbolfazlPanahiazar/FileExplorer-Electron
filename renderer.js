const { ipcRenderer } = require("electron");

// Add eventlistener on click
const items = document.getElementsByClassName("item");
Array.prototype.forEach.call(items, function (item) {
  item.addEventListener("click", function () {
    const newFiles = ipcRenderer.sendSync("get files", item.children[1].innerText);
    renderUI(newFiles, item.children[1].innerText);
  });
});

function renderUI(newFiles, back) {
  // Delete formal files
  document.getElementById("main").innerHTML = "";

  // Create back button and append
  const backElemnt = document.createElement("div");
  backElemnt.innerHTML = `<img class="w-75" src="./images/return.png" alt="folder icon" />
  <div class="h4 text-light">${back}</div>`;
  backElemnt.classList = "col-2 d-flex flex-column align-items-center item";
  backElemnt.id = 0;
  document.getElementById("main").appendChild(backElemnt);

  // Create new files and append them
  const newElements = newFiles.map((item) => {
    const theElement = document.createElement("div");
    if (item.type == "folder") {
      theElement.innerHTML = `<img class="w-75" src="./images/folder.png" alt="folder icon" />
      <span class="h4 text-light">${item.name}</span>`;
    } else if (item.type == "file") {
      theElement.innerHTML = `<img class="w-75" src="./images/file.png" alt="folder icon" />
      <div class="h4 text-light">${item.name}</div>`;
    }
    theElement.classList = "col-2 d-flex flex-column align-items-center item";
    return theElement;
  });
  newElements.forEach((item) => {
    document.getElementById("main").appendChild(item);
  });

  const items = document.getElementsByClassName("item");
  Array.prototype.forEach.call(items, function (item) {
    item.addEventListener("click", function () {
      const newFiles = ipcRenderer.sendSync("get files", item.children[1].innerText);
      renderUI(newFiles, item.children[1].innerText);
    });
  });
}
