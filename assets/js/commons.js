//WINDOW SCREENSIZE
// Verifica o dispositivo pelo tamanho de tela, orientação e pontos de touchscreen
function identifyDeviceChange() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const isMobile =
    Math.min(screenWidth, screenHeight) < 768 ||
    navigator.userAgent.indexOf("mobi") > -1;
  const isTablet =
    "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

  const deviceType = isMobile
    ? screenHeight > screenWidth
      ? "Dispositivo móvel - Retrato"
      : "Dispositivo móvel - Paisagem"
    : isTablet
    ? "Tablet"
    : "Desktop";

  return {
    deviceType: deviceType,
    screenWidth: screenWidth,
    screenHeight: screenHeight,
  };
}

//Retorna o tamanho atual da tela
let previousScreenSize = identifyDeviceChange().screenWidth;

// Verifica se houve mudanças no tamanho de tela e recarrega a página
const handleResize = () => {
  const currentScreenSize = identifyDeviceChange().screenWidth;
  previousScreenSize !== currentScreenSize ? location.reload() : "";
  previousScreenSize = currentScreenSize;
};

// BACKGROUND
const setBackground = document.getElementById("background");
const backImages = [
  "Bckg_01.png",
  "Bckg_02.png",
  "Bckg_03.png",
  "Bckg_00.png",
  "Bckg_04.png",
  "Bckg_05.png",
  "Bckg_06.png",
  "Bckg_07.png",
  "Bckg_08.png",
  "Bckg_00.png",
];

// Função que troca o background entre várias imagens em intervalos regulares:
let currentIndex = 0;

function changeBackground() {
  setBackground.style.backgroundImage = `url("./assets/imgs/${backImages[currentIndex]}")`;
  currentIndex = (currentIndex + 1) % backImages.length;
}

// Troca de imagem a cada 5 segundos
setInterval(changeBackground, 5000);

// Redireciona para a página de detalhes
const redirectToDetailPage = () => {
  const pokemons = document.querySelectorAll("[data-id]");
  pokemons.forEach((pokemon) => {
    pokemon.addEventListener("click", (event) => {
      const pokemonId = event.currentTarget.id;

      if (pokemonId !== "") {
        window.location.href = `pokemon.html?id=${pokemonId}`;
      }
    });
  });
};
