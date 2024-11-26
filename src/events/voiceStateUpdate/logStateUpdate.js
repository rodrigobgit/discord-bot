const createLogEmbed = require("../../utils/createLogEmbed");
module.exports = (client, oldState, newState) => {
	try {
		if (oldState.channelId !== newState.channelId) {
			const fieldsToAdd = [];
			let description;
			const action = { type: "VoiceStateUpdate", value: newState };
			let stateChange;
			if (oldState.channelId === null && newState.channelId !== null) {
				stateChange = "Joined";
				description = `${stateChange} <#${newState.channelId}>`;
			}
			if (oldState.channelId !== null && newState.channelId === null) {
				stateChange = "Left";
				description = `${stateChange} <#${oldState.channelId}>`;
			}
			if (oldState.channelId !== null && newState.channelId !== null) {
				stateChange = "Switched";
				description = `${stateChange} from <#${oldState.channelId}> to <#${newState.channelId}>`;
			}
			createLogEmbed(action, fieldsToAdd, description);
		}
	} catch (error) {
		console.error(error.message);
	}
};
