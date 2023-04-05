const RenderSpinner = function (parentEl) {
  // prettier-ignore
  const markup = `
      <div class="spinner"><span class="spinner__text">Checking your current location</span><svg><use href="img/sprite-spinner.svg#icon-spinner11"></use></svg></div>`;

  parentEl.classList.add("spinner-relative");

  parentEl.insertAdjacentHTML("beforeend", markup);
};

export default RenderSpinner;
