const pokeApi = {};

let evolFrom;

const convertPokeApiInfoToPokemon = (pokeInfo) => {
  const pokemon = new Pokemon();
  pokemon.number = pokeInfo.id;
  pokemon.name = pokeInfo.name;

  const types = pokeInfo.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  const imageData =
    pokeInfo["sprites"]["other"]["official-artwork"]["front_default"];

  pokemon.image = imageData;
  return pokemon;
};

pokeApi.getPokemonInfo = async (pokemon) => {
  try {
    const infoResponse = await fetch(pokemon.url);

    if (!infoResponse.ok) {
      throw new Error(`An error occurred: ${infoResponse.status}`);
    }

    pokemonInfoData = await infoResponse.json();
    return convertPokeApiInfoToPokemon(pokemonInfoData);
  } catch (error) {
    console.error("An error occurred within getPokemonInfo: ", error);
    throw error;
  }
};

pokeApi.getPokemonData = async (offset, limit) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`An error occurred: ${response.status}`);
    }

    const responseData = await response.json();
    maxCount = parseInt(responseData.count);
    const pokemons = responseData.results;
    const detailRequests = pokemons.map(pokeApi.getPokemonInfo);
    const pokemonsDetails = await Promise.all(detailRequests);

    return pokemonsDetails;
  } catch (error) {
    console.error("An error occurred within getPokemonData:", error);
    throw error;
  }
};

const convertPokeApiDetailToPokemon = (pokeDetail) => {
  const pokemon = new PokemonDetail();

  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  const imageData =
    pokeDetail["sprites"]["other"]["official-artwork"]["front_default"];

  pokemon.image = imageData;

  const abilities = pokeDetail.abilities.map(
    (abilitySlot) => abilitySlot.ability.name
  );
  const [ability] = abilities;

  pokemon.abilities = abilities;
  pokemon.ability = ability;

  pokemon.height = pokeDetail.height / 10;
  pokemon.weight = pokeDetail.weight / 10;

  const stats = pokeDetail.stats.reduce((statsObject, stat) => {
    statsObject[stat.stat.name] = stat.base_stat;
    return statsObject;
  }, {});

  pokemon.stats = stats;

  return pokemon;
};

pokeApi.getPokemonDetails = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const detailResponse = await fetch(url);

  if (!detailResponse.ok) {
    throw new Error(`An error occurred: ${detailResponse.status}`);
  }

  const pokemonDetails = await detailResponse.json();
  return convertPokeApiDetailToPokemon(pokemonDetails);
};

const convertPokeApiEvoltoData = async (evolChain) => {
  const promises = [];

  const collectData = async (evolChain) => {
    if (evolChain && evolChain.species) {
      const name = evolChain.species.name;
      promises.push(pokeApi.getPokemonDetails(name));
    }

    if (evolChain && evolChain.evolves_to) {
      for (const evolution of evolChain.evolves_to) {
        collectData(evolution);
      }
    }
  };
  collectData(evolChain);

  return Promise.all(promises);
};

pokeApi.getPokemonEvolutions = async (id) => {
  const evolUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  try {
    const speciesResponse = await fetch(evolUrl);

    if (!speciesResponse.ok) {
      throw new Error(`An error occurred: ${response.status}`);
    }

    const speciesData = await speciesResponse.json();
    evolFrom = speciesData.evolves_from_species?.name;

    const evolChainUrl = speciesData.evolution_chain.url;
    const evolChainResponse = await fetch(evolChainUrl);

    if (!evolChainResponse.ok) {
      throw new Error(`An error occurred: ${evolChainResponse.status}`);
    }

    const evolChainData = await evolChainResponse.json();
    const evolChain = evolChainData.chain;

    return convertPokeApiEvoltoData(evolChain);
  } catch (error) {
    console.error("An error occurred within getPokemonEvolutions:", error);
    throw error;
  }
};
