(function initializeDfmsPrototype() {
  console.info("DFMS prototype shell loaded.");

  var gridBody = document.getElementById("dispatch-grid-body");
  if (!gridBody) {
    return;
  }

  if (!gridBody.children.length) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.colSpan = 17;
    cell.textContent = "Dynamic mission rows will be rendered in a later ticket.";
    row.appendChild(cell);
    gridBody.appendChild(row);
  }
})();
