const SEREBII_BASE_URL = "https://www.serebii.net";
const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

const API_URLS = {
	POKEMON_INFO: (pokemonName) => `${POKEAPI_BASE_URL}/pokemon/${pokemonName}/`,
	POKEMON_SHINY_FORM: (pokemonNo) => `${SEREBII_BASE_URL}/Shiny/SV/new/${pokemonNo}.png`,
	POKEMON_NORMAL_FORM: (pokemonNo) => `${SEREBII_BASE_URL}/scarletviolet/pokemon/new/${pokemonNo}.png`,
	POKEMON_TYPE_INFO: (type) => `${POKEAPI_BASE_URL}/type/${type}/`,
	POKEMON_TYPE_LIST: `${POKEAPI_BASE_URL}/type/`,
	POKEMON_MOVE_INFO: (move) => `${POKEAPI_BASE_URL}/move/${move}/`
};

module.exports = API_URLS;
