const { AttachmentBuilder } = require("discord.js");
const path = require("path");
module.exports = {
	definition: {
		name: "dabosses",
		description: "Get DA bosses by type"
	},

	callback: async (client, interaction) => {
		try {
			const filePath = path.resolve(__dirname, "../../../assets/media/dabosses.png");
			const attachment = new AttachmentBuilder(filePath);
			await interaction.reply({
				files: [attachment]
			});
		} catch (error) {
			console.error("Error fetching DA bosses:", error);
			await interaction.reply("Error fetching DA bosses.");
		}
	}
};
