const toggleLandscapeAlert = (deviceType) => {
  const landscapeAlert = document.getElementById("alert-screen");
  if (deviceType == "Dispositivo móvel - Paisagem") {
    landscapeAlert.classList.remove("hidden");
  } else {
    landscapeAlert.classList.add("hidden");
  }
};

const deviceType = identifyDeviceChange().deviceType;

toggleLandscapeAlert(deviceType);
window.addEventListener("resize", () => {
  handleResize();
  // toggleLandscapeAlert(deviceType);
});

// Atribui cores em relação aos valores dos stats
const convertPercentToColor = (value) => {
  if (value <= 12.5) {
    return "#DC143C";
  } else if (value <= 25) {
    return "#FFA500";
  } else if (value <= 37.5) {
    return "#FFD700";
  } else {
    return "#9ACD32";
  }
};

// Atribui o fundo animado da página da imagem do pokemon
const convertTypeColorToCardBack = (type, screenSize) => {
  let colorInfo = "";
  let cardHeight = 0;

  screenSize < 385 ? (cardHeight = 150) : (cardHeight = 135);

  switch (type) {
    case "grass":
    case "bug":
      colorInfo = "gradient&customColorList=17,21,23,26";
      break;
    case "fire":
      colorInfo = "gradient&customColorList=5,7,9,10,11,16,29";
      break;
    case "water":
    case "ice":
      colorInfo = "gradient&customColorList=2,12,19";
      break;
    case "fairy":
      colorInfo = "gradient&customColorList=1,14,15,18";
      break;
    case "fighting":
      colorInfo = "gradient&customColorList=5,7,9,11,29";
      break;
    case "poison":
      colorInfo = "gradient&customColorList=9,20,22,24,25";
      break;
    case "steel":
      colorInfo = "gradient&customColorList=21,22,25";
      break;
    case "dark":
      colorInfo = "gradient&customColorList=13,16,22,25";
      break;
    case "psychic":
      colorInfo = "gradient&customColorList=1,7,9,18,20,24,27";
      break;
    case "ground":
    case "rock":
      colorInfo = "0:f7de3f,100:4C4637";
      break;
    case "dragon":
      colorInfo = "0:058AD0,20:53a4cf,80:f16e57,100:CA4D3A";
      break;
    case "flying":
      colorInfo = "0:0097E0,25:3dc8ef,100:766F7D";
      break;
    case "ghost":
      colorInfo = "0:412C67,50:7B62A3,100:A34D9C";
      break;
    case "electric":
      colorInfo = "0:EED535,50:EED535,100:AC9E68";
      break;
    default:
      colorInfo = "gradient&customColorList=3,14,15,18,25";
  }
  const customUrl = `https://capsule-render.vercel.app/api?type=waving&color=${colorInfo}&height=${cardHeight}`;

  return customUrl;
};

// Injeta os elementos Html pokemon, criados na página
const injectPokemonDetail = (pokemon) => {
  const elementName = document.getElementById("pkmName");
  const elementNumber = document.getElementById("pkmNumber");
  const elementImage = document.getElementById("pkmImg");
  const elementHeight = document.getElementById("pkmHeight");
  const elementWeight = document.getElementById("pkmWeight");
  const elementTypes = document.getElementsByClassName("pkmTypes")[0];
  const elementAbilities = document.getElementById("pkmAbilities");
  const elementStats = document.getElementById("pkmStats");
  const elementCard = document.getElementById("card");

  const cardBackground = convertTypeColorToCardBack(
    pokemon.types[0],
    identifyDeviceChange().screenWidth
  );

  const cardStyleBackground = `url(${cardBackground})
          top / cover no-repeat,
        linear-gradient(to bottom, #fff 80%, transparent), #ccc url(./assets/imgs/pokePattern_02.svg) bottom / 35px repeat`;

  elementCard.style.background = cardStyleBackground;
  elementName.textContent = pokemon.name;
  elementNumber.textContent = `#${pokemon.number.toString().padStart(3, "0")}`;
  elementImage.style.backgroundImage = `url(${pokemon.image})`;
  elementHeight.textContent = pokemon.height.toFixed(2) + " m";
  elementWeight.textContent = pokemon.weight.toFixed(1) + " kg";

  pokemon.types.map((type) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${type}`;
    listItem.classList.add("type", `${type}`);
    elementTypes.appendChild(listItem);
  });

  pokemon.abilities.map((ability) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${ability}`;
    elementAbilities.appendChild(listItem);
  });

  let totalStats = 0;
  for (const stat in pokemon.stats) {
    if (pokemon.stats.hasOwnProperty(stat)) {
      const value = pokemon.stats[stat];
      totalStats += value;

      const percent = ((100 * value) / 255).toFixed(2);
      const statsHtmlString = `
    	<li class="stats">
   			<span class="stats-title">${stat}</span>
   			<span class="stats-value">${value}</span>
   			<div class="contentBar">
       			<div class="innerBar ${stat}" style="width:${percent}%; background-color: ${convertPercentToColor(
        percent
      )}"></div>
    		</div>
   		</li>`;

      const fragment = document.createDocumentFragment();
      const parser = new DOMParser();
      const statElement = parser.parseFromString(statsHtmlString, "text/html")
        .body.firstChild;
      fragment.appendChild(statElement);
      elementStats.appendChild(fragment);
    }
  }
  const totalPercent = ((100 * totalStats) / 1530).toFixed(2);
  const totalStatsHtmlString = `
       	<li class="stats">
   			<span class="stats-title">total</span>
   			<span class="stats-value">${totalStats}</span>
   			<div class="contentBar">
       			<div class="innerBar total" style="width:${totalPercent}%; background-color: ${convertPercentToColor(
    totalPercent
  )}"></div>
    		</div>
   		</li>`;

  const fragment = document.createDocumentFragment();
  const parser = new DOMParser();
  const totalElement = parser.parseFromString(totalStatsHtmlString, "text/html")
    .body.firstChild;
  fragment.appendChild(totalElement);
  elementStats.appendChild(fragment);
};

// Injeta os elementos Html das evoluções na página
const injectPokemonEvol = (pokemon) => {
  elementCardBack = document.getElementsByClassName("card-detail-back")[0];
  elementCardFront = document.getElementsByClassName("card-detail-front")[0];

  const cardBackground = convertTypeColorToCardBack(
    pokemon[0].types[0],
    identifyDeviceChange().screenWidth
  );

  const pokemonBaseHtml = `
    <div class="base-wrapper" id="${
      pokemon[0].number
    }" data-id style="background: url(${cardBackground})
          top / cover no-repeat, #fff">
          <div class="imgWrapper">
					  <img src="${pokemon[0].image}" alt="${pokemon[0].name}">
          </div>
					<div class="basic-info">
						<span>${pokemon[0].name}</span>
						<span>#${pokemon[0].number.toString().padStart(3, "0")}</span>
					</div>
          <span>Evoluções:</span>
				</div>
  `;

  pokemon.shift();

  const evolListHtml = `
  <ol class="evol-list">
    ${pokemon
      .map(
        (pokemon) => `
    <li class="pokemon ${pokemon.type}" id="${pokemon.number}" data-id>
        <div class="basic-info">
            <span class="name">${pokemon.name}</span>
            <span class="number">#${pokemon.number
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
    </li>`
      )
      .join("")}
  </ol>
  `;

  // Verifica se o pokemon tem evoluções e altera parâmetros da página
  const manageEvol = (pokemon = []) => {
    if (pokemon.length >= 1) {
      const fragment = document.createDocumentFragment();
      const parser = new DOMParser();

      const baseElement = parser.parseFromString(pokemonBaseHtml, "text/html")
        .body.firstChild;
      const evolList = parser.parseFromString(evolListHtml, "text/html").body
        .firstChild;

      evolList.style.justifyContent = "center";

      fragment.appendChild(baseElement);
      fragment.appendChild(evolList);
      elementCardBack.appendChild(fragment);

      const flipBtn = document.getElementById("flip");
      if (flipBtn.classList.contains("hidden"))
        setTimeout(() => flipBtn.classList.remove("hidden"), 1000);

      if (pokemon.length > 2) {
        const elementEvolList = document.getElementsByClassName("evol-list")[0];
        elementEvolList.style.justifyContent = "flex-start";
        elementEvolList.classList.add("scroll");
      }
    }
  };
  manageEvol(pokemon);
};

// Requisita os dados de detalhes dos pokemons na API
const requestPokemonDetails = async (id) => {
  await pokeApi
    .getPokemonDetails(id)
    .then((pokemonDetails) => injectPokemonDetail(pokemonDetails));
};

// Requisita dados das evoluções dos pokemons na API
const requestPokemonEvol = async (id) => {
  await pokeApi
    .getPokemonEvolutions(id)
    .then((evolution) => injectPokemonEvol(evolution));

  redirectToDetailPage();
};

// Recebe os URL Params da página anterior
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get("id");

  requestPokemonDetails(pokemonId);
  requestPokemonEvol(pokemonId);
});

const flipBtn = document.querySelector("#flip");

flipBtn.addEventListener("click", () => {
  const elementCardBack =
    document.getElementsByClassName("card-detail-back")[0];
  const elementCardFront =
    document.getElementsByClassName("card-detail-front")[0];
  const flipIcon = flipBtn.firstElementChild;

  if (elementCardFront.classList.contains("turn-card-front")) {
    elementCardBack.classList.remove("turn-card-back");
    elementCardFront.classList.remove("turn-card-front");
    flipIcon.classList.remove("icon-rotate");
  } else {
    elementCardFront.classList.add("turn-card-front");
    elementCardBack.classList.add("turn-card-back");
    flipIcon.classList.add("icon-rotate");
  }
});
