const path = require("path");
const getDirFilePath = require("./utils/getDirFilePath");
require("dotenv").config();
const { REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

const publicGuildIds = process.env.GUILD_IDS.split(",");
const privateGuildId = process.env.PRIVATE_GUILD_ID;

const publicCommandFiles = getDirFilePath(path.join(__dirname, "commands/public"));
const privateCommandFiles = getDirFilePath(path.join(__dirname, "commands/private"));

const publicCommands = publicCommandFiles.map((file) => {
	const command = require(file);
	return command.definition;
});
const privateCommands = privateCommandFiles.map((file) => {
	const command = require(file);
	return command.definition;
});

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");
		for (const guildId of publicGuildIds) {
			await rest.put(Routes.applicationGuildCommands(process.env.APP_ID, guildId), { body: publicCommands });
		}
		await rest.put(Routes.applicationGuildCommands(process.env.APP_ID, privateGuildId), {
			body: [...privateCommands, ...publicCommands]
		});
		console.log("Sucessful register");
	} catch (error) {
		console.log("Error found: " + error);
	}
})();
