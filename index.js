const rowData = document.getElementById("rowData");
const searchInput = document.getElementById("movieSearch");
const apiKey = "bc08240db32627f57156b443c68ec517";
const apiUrl = `https://api.themoviedb.org/3/`;
const navLinks = Array.from(document.querySelectorAll(".category"));
const inputs = document.querySelectorAll("input");
const submitBtn = document.getElementById("submit");
const footer = document.getElementById("contact");
const passwordInput = document.getElementById("password");
const rePasswordInput = document.getElementById("rePassword");
const formAlert = document.getElementById("formAlert");
const errorMsg = document.getElementById("errorMsg");
const spinner = document.getElementById("spinner");

$(".fa-bars").on("click", function () {
  $("aside").animate({ width: "toggle" }, 500);
  $(".nav").removeClass("d-none");
  $(".nav").css("animation", "fadeIn 1.5s");
  $(".fa-xmark").removeClass("d-none");
  $(".fa-bars").addClass("d-none");
  $(".icons").animate({ left: "10%" }, 500);
});

$(".fa-xmark").on("click", function () {
  $("aside").animate({ width: "toggle" }, 500);
  $(".nav").addClass("d-none");
  $(".fa-xmark").addClass("d-none");
  $(".fa-bars").removeClass("d-none");
  $(".icons").animate({ left: "0%" }, 500);
});

async function getMovies(url) {
  try {
    const response = await fetch(url);
    console.log(response);
    if (!response.ok) {
      displayError(response.status);
    }
    const data = await response.json();
    const { results } = data;
    console.log(results);
    displayData(results);
  } catch (error) {
    console.error("Error:", error);
  }
}

getMovies(`${apiUrl}trending/all/day?api_key=${apiKey}`);

function displayData(data) {
  let box = ``;
  data.forEach((movie) => {
    box += `
    <div class="col-lg-4 gy-3 position-relative movie-card">
        <img
          src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
          class="w-100 movie-img"
          alt="${movie.title}"
        />
        <div class="movie-layer text-center">
          <h5>${movie.title || movie.name}</h5>
          <p>${movie.overview.slice(0, 100)}...</p>
          <p class="text-start"> release Date : ${
            movie.release_date || movie.first_air_date
          }</p>
          <div class='d-flex justify-content-start align-items-start gap-3 flex-column w-50'>
          <div>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          </div>
          <p class="bg-success p-1 rounded rounded-4">${movie.vote_average}</p>
          </div>
        </div>
      </div>
    </div>
    `;
  });
  rowData.innerHTML = box;
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.dataset.category === "trending") {
      getMovies(`${apiUrl}trending/movie/day?api_key=${apiKey}`);
    }

    if (event.target.id === "contact") {
      $("body").animate({ scroll: footer.offset().top }, 500);
    }
    const category = event.target.getAttribute("data-category");
    getMovies(`${apiUrl}movie/${category}?api_key=${apiKey}`);
  });
});

searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  getMovies(
    `${apiUrl}search/movie?query=${searchTerm}&page=1&api_key=${apiKey}`
  );

  if (!searchInput.value.length)
    getMovies(`${apiUrl}trending/all/day?api_key=${apiKey}`);
});

function displayError(error) {
  rowData.innerHTML = `
  <div class="alert alert-danger d-flex align-items-center" role="alert">
  <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
  <div>
  <h1 class='text-center text-danger fs-3 fw-bold'>
  HTTP error! status: ${error} Try again Later!
  </h1>
  </div>
</div>
  `;
}

function checkInputs(element) {
  const regex = {
    name: /^[a-zA-Z\s]+$/,
    phoneNum: /^01[0125][0-9]{8}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    age: /^[1-9][0-9]$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
    rePassword:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
  };

  if (regex[element.id].test(element.value)) {
    element.classList.add("is-valid");
    element.nextElementSibling.classList.add("d-none");
    element.classList.remove("is-invalid");
  } else {
    element.nextElementSibling.classList.remove("d-none");
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
  }
}

inputs.forEach((input) => {
  input.addEventListener("input", function (e) {
    checkInputs(e.target);
  });
});

submitBtn.addEventListener("click", function () {
  inputs.forEach((input) => {
    if (
      input.classList.contains("is-invalid") ||
      !input.value.length ||
      !input.nextElementSibling.classList.contains("d-none")
    ) {
      formAlert.classList.remove("d-none");
      errorMsg.innerText = "All fields are required and valid!";
      input.classList.add("is-invalid");
    } else if (passwordInput.value !== rePasswordInput.value) {
      passwordInput.nextElementSibling.innerText = "Password does not match";
      passwordInput.nextElementSibling.classList.remove("d-none");
      rePasswordInput.nextElementSibling.innerText = "Password does not match";
      rePasswordInput.nextElementSibling.classList.remove("d-none");
    } else {
      formAlert.classList.add("d-none");
      errorMsg.innerText = "";
      alert("Form submitted successfully!");
      passwordInput.value = "";
      rePasswordInput.value = "";
      inputs.forEach((input) => {
        input.classList.remove("is-valid");
        input.classList.remove("is-invalid");
        input.nextElementSibling.classList.add("d-none");
      });
    }
  });
});
