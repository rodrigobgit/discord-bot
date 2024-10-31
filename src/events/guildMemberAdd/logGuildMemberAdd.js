const createLogEmbed = require("../../utils/createLogEmbed");
module.exports = (client, member) => {
	try {
		const fieldsToAdd = [];
		const action = { type: "GuildMember", value: member };
		const description = `Joined the server`;
		createLogEmbed(action, fieldsToAdd, description);
	} catch (error) {
		console.error(error.message);
	}
};
