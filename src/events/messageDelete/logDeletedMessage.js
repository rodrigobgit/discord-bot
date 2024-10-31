const { EmbedBuilder } = require("discord.js");
module.exports = (client, message) => {
	try {
		const guild = message.guild;
		if (guild) {
			const logsChannelName = "logs";
			const logsChannel = guild.channels.cache.find((channel) => channel.name === logsChannelName);
			if (logsChannel) {
				buildLogEmbed(message, logsChannel);
			}
		}
	} catch (error) {
		console.error(error.message);
	}
};

async function buildLogEmbed(message, channel) {
	const fields = [];
	const currentTime = new Date().toLocaleString();
	if (message.content) {
		fields.push({ name: "Content", value: message.content });
	}
	if (message.attachments.size > 0) {
		const attachments = message.attachments.map((attachment) => attachment.url);
		fields.push({ name: "Attachments", value: attachments.join("\n") });
	}
	fields.push({ name: "Time", value: currentTime });
	const embed = new EmbedBuilder()
		.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
		.setDescription(`Deleted a message in <#${message.channel.id}>`);
	for (const field of fields) {
		embed.addFields(field);
	}
	await channel.send({ embeds: [embed] });
}
