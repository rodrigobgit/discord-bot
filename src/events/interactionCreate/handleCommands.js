const path = require("path");
const getDirFilePath = require("../../utils/getDirFilePath");

module.exports = (client, interaction) => {
	const commandName = interaction.commandName;
	const commandFolders = getDirFilePath(path.join(__dirname, "../../commands"), true);
	commandFolders.forEach((folder) => {
		const commandFiles = getDirFilePath(folder);
		const commandFile = commandFiles.find((file) => {
			const fileName = path.basename(file, path.extname(file));
			return fileName === commandName;
		});
		if (commandFile) {
			const commandFunction = require(commandFile);
			commandFunction.callback(client, interaction);
		}
	});
};
