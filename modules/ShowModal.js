let modalOverlay = document.querySelector(".overlay");

const ShowModal = function (parentEl, message) {
  let modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `<button class="modal__close">X</button>
      <span class="modal__text">${message}</span>`;
  modalOverlay = document.createElement("div");
  modalOverlay.classList.add("overlay");
  parentEl.append(modalOverlay);
  parentEl.append(modal);
};

export default ShowModal;
