const {
	ApplicationCommandOptionType,
	Client,
	Interaction
} = require("discord.js");

module.exports = {
	definition: {
		name: "ilhas",
		description: "Registar ilhas",
		options: [
			{
				name: "coordenadas",
				description: "Coordenadas da ilha",
				type: ApplicationCommandOptionType.String,
				required: true
			},
			{
				name: "tempo",
				description: "Tempo hh:mm",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	},

	callback: async (client, interaction) => {
		console.log("ilhas func");
		interaction.reply("Em desenvolvimento!");
	}
};
