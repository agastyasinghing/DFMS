(function initializeDfmsPrototype() {
  console.info("DFMS prototype app.js loaded.");

  var placeholder = document.getElementById("dispatch-grid-placeholder");
  if (!placeholder) {
    return;
  }

  placeholder.textContent =
    "Dispatch grid scaffold is ready. Data model, filters, and mission rendering will be added in later tickets.";
})();
