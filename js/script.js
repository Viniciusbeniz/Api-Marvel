const marvelApiKey = '2a02325b6e3d242823fc5830394660e0';
const privateKey = '23ee9ecdec6a16ddb7ea01b6ed3c0483cfec1340';
const hash = '507504070014a8ad72fb17de505b2625';
const timestamp = '1'

// Criar o slider com Swipper
function createNewSwiper() {
  new Swiper(".heroSwiper", {
    draggable: true,
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 50,
    observer: true,
    observeParents: true,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
  });
}

// Inserir um slide para cada herói
function setAllHeroes(heroes) {
  let swiper = document.getElementById("swiper");

  if (heroes.length == 0) return swiper.innerHTML = '<div class="swiper-slide">Sem resultados</div>'

  const heroesHTML = heroes.map(hero => {
    let slideElement = `
      <div class="swiper-slide hero">
        <a class="hero-image" href="${hero.urls[0].url}" target="_blank">
          <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}">
          <span class="hero-name">${hero.name}</span>
        </a>
      </div>
    `;

    return slideElement;
  })

  swiper.innerHTML = heroesHTML.join(" ");
}

// Buscar todos os heróis da Marvel
function getAllHeroes() {
  fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=2a02325b6e3d242823fc5830394660e0&hash=507504070014a8ad72fb17de505b2625`)
    .then(response => response.json())
    .then(response => {
      const heroes = response.data.results;
      setAllHeroes(heroes);
    })
}

// Pesquisar por heróis específicos da Marvel
function searchHero() {
  const search = document.getElementById("search");

  const nameStartsWith = search.value.length > 0 ? `&nameStartsWith=${search.value}` : ''

  fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=2a02325b6e3d242823fc5830394660e0&hash=507504070014a8ad72fb17de505b2625&limit=100${nameStartsWith}`)
    .then(response => response.json())
    .then(response => {
      const heroes = response.data.results;
      setAllHeroes(heroes);
    })
}

function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

getAllHeroes();
createNewSwiper();
document.getElementById("search").addEventListener("input", debounce(searchHero, 800));
document.getElementById("search").addEventListener("propertychange", debounce(searchHero, 800)); // IE18