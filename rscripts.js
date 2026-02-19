document.querySelectorAll(".timeline-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".timeline-item")
      .forEach(i => i.style.outline = "none");

    item.style.outline = "2px solid #2563eb";
  });
});
