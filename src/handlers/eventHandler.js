const path = require("path");
const getDirFilePath = require("../utils/getDirFilePath");

module.exports = (client) => {
	const eventFolders = getDirFilePath(path.join(__dirname, "../events"), true);
	eventFolders.forEach((folder) => {
		const eventFiles = getDirFilePath(folder);
		const eventName = folder.replace(/\\/g, "/").split("/").pop();
		client.on(eventName, async (...arg) => {
			for (const file of eventFiles) {
				const eventFunction = require(file);
				await eventFunction(client, ...arg);
			}
		});
	});
};
