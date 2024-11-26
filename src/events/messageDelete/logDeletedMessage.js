const createLogEmbed = require("../../utils/createLogEmbed");
module.exports = (client, message) => {
	try {
		const fieldsToAdd = [];
		const action = { type: "MessageDelete", value: message };
		const description = `Deleted a message in <#${message.channel.id}>`;
		if (message.content) {
			fieldsToAdd.push({ name: "Content", value: message.content });
		}
		if (message.attachments.size > 0) {
			const attachments = message.attachments.map((attachment) => attachment.url);
			fieldsToAdd.push({ name: "Attachments", value: attachments.join("\n") });
		}
		createLogEmbed(action, fieldsToAdd, description);
	} catch (error) {
		console.error(error.message);
	}
};
