const { ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const API_URLS = require("../../../config/apiConfig");
module.exports = {
	definition: {
		name: "shiny",
		description: "Get Pokemon shiny version",
		options: [
			{
				name: "pokemon",
				description: "Pokemon name",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	},

	callback: async (client, interaction) => {
		let pokemon = interaction.options.get("pokemon").value.toLowerCase();
		pokemon = pokemon.replaceAll(" ", "-");
		try {
			const dexNumber = await getDexNumber(pokemon);
			const shinySpriteUrl = await getShinySprite(dexNumber);
			const normalSpriteUrl = await getNormalSprite(dexNumber);
			const shinyAttachment = new AttachmentBuilder(shinySpriteUrl);
			const normalAttachment = new AttachmentBuilder(normalSpriteUrl);
			await interaction.reply({
				files: [normalAttachment, shinyAttachment]
			});
		} catch (error) {
			await interaction.reply("Error fetching shiny sprite");
		}
	}
};

async function getDexNumber(pokemon) {
	const url = API_URLS.POKEMON_INFO(pokemon);
	const response = await axios.get(url);
	return response.data.id;
}

async function getShinySprite(dexNumber) {
	const url = API_URLS.POKEMON_SHINY_FORM(dexNumber);
	return url;
}

async function getNormalSprite(dexNumber) {
	const url = API_URLS.POKEMON_NORMAL_FORM(dexNumber);
	return url;
}
