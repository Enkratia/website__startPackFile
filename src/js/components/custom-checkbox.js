const customCheckboxes = document.querySelectorAll(".custom-checkbox");

// Function(s)
function checkCustomCheckbox() {
  const checkbox = this.parentElement;

  checkbox.classList.toggle("custom-checkbox--checked");
  const isAriaChecked = checkbox.getAttribute("aria-checked");

  if (isAriaChecked === "false") {
    checkbox.setAttribute("aria-checked", "true");
  } else {
    checkbox.setAttribute("aria-checked", "false");
  }
}

// Listener(s)
customCheckboxes.forEach(el => {
  const nativeCheckbox = el.querySelector(".custom-checkbox__input");
  nativeCheckbox.addEventListener("change", checkCustomCheckbox);
});