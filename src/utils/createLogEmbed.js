const { EmbedBuilder } = require("discord.js");
module.exports = (action, fieldsToAdd, description) => {
	try {
		const guild = action.value.guild;
		if (guild) {
			const logsChannelName = "logs";
			const logsChannel = guild.channels.cache.find((channel) => channel.name === logsChannelName);
			if (logsChannel) {
				createLogEmbed(action, logsChannel, fieldsToAdd, description);
			}
		}
	} catch (error) {
		console.error(error.message);
	}
};

async function createLogEmbed(action, channel, fieldsToAdd, description) {
	const currentTime = new Date().toLocaleString();
	const author = await getAuthor(action);
	const embed = new EmbedBuilder()
		.setAuthor(author)
		.setDescription(String(description))
		.setFooter({ text: `${currentTime}` });
	for (const field of fieldsToAdd) {
		embed.addFields(field);
	}
	await channel.send({ embeds: [embed] });
}

async function getAuthor(action) {
	let author;
	switch (action.type) {
		case "VoiceStateUpdate":
			const member = action.value.guild.members.cache.find((member) => member.user.id === action.value.id);
			author = { name: member.user.username, iconURL: member.user.avatarURL() };
			break;
		case "MessageDelete":
			author = { name: action.value.author.username, iconURL: action.value.author.avatarURL() };
			break;
		case "GuildMember":
			author = { name: action.value.user.username, iconURL: action.value.user.avatarURL() };
			break;
		default:
			return "Unknown";
	}
	return author;
}
