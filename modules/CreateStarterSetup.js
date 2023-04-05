import RenderSpinner from "./RenderSpinner.js";
import ShowModal from "./ShowModal.js";
import searchWeather from "../script.js";

const CreateStarterSetup = function (mainBody, reverseGeoCode) {
  mainBody.classList.remove("body__generated");
  const mainInput = document.querySelector(".hero-search__input");
  const startBtn = document.querySelector(".hero-search__btn");
  const localBtn = document.querySelector(".btn__local");
  const helperText = document.querySelector(".search__helper__text");

  if (document.body.clientWidth > 600) mainInput.focus();

  mainBody.addEventListener("click", function (e) {
    e.preventDefault();
    const clicked = e.target.closest(".modal__close");
    if (!clicked) return;
    hideModal();
    clear(mainBody);
    mainBody.insertAdjacentHTML("afterbegin", createStartMarkUp);
    createStarterSetUp();
  });

  mainInput.addEventListener("keydown", function (e) {
    if (e.keyCode == 13) {
      query = mainInput.value;
      console.log(query);
      if (query === "") {
        helperText.style.opacity = "100";
        helperText.style.transform = "translateY(-2rem)";
      }
      if (query !== "") searchWeather(query);
    }
  });

  startBtn.addEventListener("click", function (e) {
    if (e.target.closest(".hero-search__btn")) {
      query = mainInput.value;
      if (query === "") {
        helperText.style.opacity = "100";
        helperText.style.transform = "translateY(-2rem)";
      }
      if (query !== "") searchWeather(query);
    }
  });
  localBtn.addEventListener("click", function (e) {
    RenderSpinner(mainBody);

    navigator.geolocation.getCurrentPosition(
      async function (position) {
        try {
          const { latitude, longitude } = position.coords;
          const data = await reverseGeoCode(latitude, longitude);
          const currentCity = data[0].name;
          searchWeather(currentCity);
        } catch (error) {
          ShowModal(mainBody, error.message);
        }
      },
      function () {
        alert("Could not get your position");
      }
    );
  });
};

export default CreateStarterSetup;
