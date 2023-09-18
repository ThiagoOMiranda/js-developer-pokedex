const pokemonListElement = document.getElementById("pokemonList");
const loader = document.getElementById("loader");

let offset = 0;
let limit = 0;
let maxCount = 0;

//POKÉDEX
// Convert as informações coletadas de cada pokemon na API e retorna htmlNode Object
const convertPokemonToNode = (pokemon) => {
  const pokemonHtmlString = `
  <li class="pokemon box ${pokemon.type}" id="${
    pokemon.number
  }" data-id data-tilt data-tilt-scale="1.1" data-tilt-glare data-tilt-max-glare="0.8">
        <div class="basic-info box">
            <span class="name inner-soft">${pokemon.name}</span>
            <span class="number inner-soft">#${pokemon.number
              .toString()
              .padStart(3, "0")}</span>
        </div>
        <div class="detail inner">
          <ol class="types">
                <span>Tipo:</span>
                ${pokemon.types
                  .map((type) => `<li class="type ${type}">${type}</li>`)
                  .join("")}
          </ol>
          <img src="${pokemon.image}"
            alt="${pokemon.name}">
        </div>
    </li>
    `;

  const fragment = document.createDocumentFragment();
  const parser = new DOMParser();
  const pokemonElement = parser.parseFromString(pokemonHtmlString, "text/html")
    .body.firstChild;
  handleVanillaTilt(pokemonElement, identifyDeviceChange().deviceType);
  fragment.appendChild(pokemonElement);
  pokemonListElement.appendChild(fragment);
};

// Função que requisita os dados da pokeAPI
const makeRequest = async (offset, limit) => {
  await pokeApi
    .getPokemonData(offset, limit)
    .then((pokemon = []) =>
      pokemon.map((pokemon) => convertPokemonToNode(pokemon))
    );

  // const pokemons = document.querySelectorAll(".pokemon");
  // handleVanillaTilt(pokemons, identifyDeviceChange().deviceType);
  redirectToDetailPage();
};

// Determina a quantidade de posições na página em função do tamanho da tela
const positionsQuantity = (screenSize) => {
  const currentOrientation = window.screen.orientation.type;

  if (screenSize < 385) {
    return {
      initialLimit: 10,
      offset: 5,
      limit: 5,
      placeholdQtd: 1,
    };
  } else if (screenSize < 768) {
    return {
      initialLimit: 10,
      offset: 6,
      limit: 4,
      placeholdQtd: 2,
    };
  } else if (screenSize < 900) {
    return {
      initialLimit: 28,
      offset: 20,
      limit: 8,
      placeholdQtd: 4,
    };
  } else if (screenSize >= 900 && currentOrientation === "portrait-primary") {
    return {
      initialLimit: 40,
      offset: 30,
      limit: 10,
      placeholdQtd: 5,
    };
  } else {
    return {
      initialLimit: 20,
      offset: 10,
      limit: 10,
      placeholdQtd: 5,
    };
  }
};

// Cria placeholders baseados na quantidade
const createPlaceholder = (quantity) => {
  const placeholder = document.createElement("li");
  placeholder.className = "placeholder";
  const placeholderList = Array.from({length: quantity}, () =>
    placeholder.cloneNode(true)
  );
  placeholderList.forEach((placeholder) => loader.appendChild(placeholder));
};

// Inicia o VanillaTilt somente me Desktop Devices
const handleVanillaTilt = (htmlElement, screenSize) => {
  screenSize === "Desktop" ? VanillaTilt.init(htmlElement) : "";
};

// INFINITE SCROLL
// Gerencia as ações do Infinite Scroll
const loadInfiniteScroll = (offset, limit, maxCount) => {
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry.intersectionRatio >= 0.5 && lastEntry.isIntersecting) {
        offset += limit;
        const qtdRecordsNext = offset + limit;

        if (qtdRecordsNext >= maxCount) {
          const newLimit = maxCount - offset;
          makeRequest(offset, newLimit);
          intersectionObserver.unobserve(loaderSentinel);
          loader.remove();
        } else {
          makeRequest(offset, limit);
        }
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    }
  );

  const loaderSentinel = document.querySelector("#loader");
  intersectionObserver.observe(loaderSentinel);
};

// MAIN FUNCTION
const main = async () => {
  window.addEventListener("resize", () => handleResize());

  const deviceScreenWidth = identifyDeviceChange().screenWidth;
  let initialLimit = positionsQuantity(deviceScreenWidth).initialLimit;

  await makeRequest(0, initialLimit);

  const placeholdQtd = positionsQuantity(deviceScreenWidth).placeholdQtd;
  createPlaceholder(placeholdQtd);

  limit = positionsQuantity(deviceScreenWidth).limit;
  offset = positionsQuantity(deviceScreenWidth).offset;

  await new Promise((resolve) => setTimeout(resolve, 100));
  loadInfiniteScroll(offset, limit, maxCount);
};

main();
