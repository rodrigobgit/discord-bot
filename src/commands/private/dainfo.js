const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const API_URLS = require("../../../config/apiConfig");
module.exports = {
	definition: {
		name: "dainfo",
		description: "Get Pokemon DA info",
		options: [
			{
				name: "pokemon",
				description: "Pokemon name",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	},
	callback: async (client, interaction) => {
		let pokemon = interaction.options.get("pokemon").value;
		await interaction.deferReply();
		try {
			const rentalPokemonInfo = await getRentalPokemonInfo(pokemon);
			if (rentalPokemonInfo) {
				const generalPokemonInfo = await getGeneralPokemonInfo(pokemon);
				const paddedDexNumber = String(generalPokemonInfo.dexNumber).padStart(3, "0");
				const pokemonSprite = await getPokemonSprite(paddedDexNumber);
				const guildEmojis = interaction.guild.emojis.cache;
				const ballEmoji = guildEmojis.find((e) => e.name === "beastball");
				const pokemonTypeEmojis = getGuildEmojis(generalPokemonInfo.types, guildEmojis);
				const typesField = { name: "Types", value: pokemonTypeEmojis.join(" "), inline: true };
				const levelField = { name: "Level", value: `Level ${rentalPokemonInfo.level}`, inline: true };
				const abilityField = { name: "Ability", value: rentalPokemonInfo.ability, inline: true };
				const baseStatsField = {
					name: "Base Stats",
					value: `Hp: ${generalPokemonInfo.baseStats[0].value}\nAttack: ${generalPokemonInfo.baseStats[1].value}\nDefense: ${generalPokemonInfo.baseStats[2].value}\nSp. Attack: ${generalPokemonInfo.baseStats[3].value}\nSp. Defense: ${generalPokemonInfo.baseStats[4].value}\nSpeed: ${generalPokemonInfo.baseStats[5].value}`
				};
				const formattedAttacks = [];
				for (const move of rentalPokemonInfo.attacks) {
					const moveInfo = await getMoveInfo(move.toLowerCase());
					const moveTypeEmoji = getGuildEmojis([moveInfo.type], guildEmojis);
					const moveDamageClassEmoji = getGuildEmojis([moveInfo.damageClass], guildEmojis);
					const formattedMove = `${move}  ${moveTypeEmoji}  ${moveDamageClassEmoji}`;
					formattedAttacks.push(formattedMove);
				}
				const attacksField = { name: "Attacks", value: formattedAttacks.join("\n") };
				const typeRelations = generalPokemonInfo.typeRelations;
				const embed = new EmbedBuilder()
					.setTitle(
						`${ballEmoji}${rentalPokemonInfo.name} #${paddedDexNumber} - Dynamax Adventures profile${ballEmoji}`
					)
					.setThumbnail(pokemonSprite)
					.addFields(typesField, levelField, abilityField, baseStatsField, attacksField);

				if (rentalPokemonInfo.desperation) {
					const desperationMoveInfo = await getMoveInfo(rentalPokemonInfo.desperation?.move?.toLowerCase());
					const desperationMoveTypeEmoji = getGuildEmojis([desperationMoveInfo.type], guildEmojis);
					const desperationMoveDamageClassEmoji = getGuildEmojis(
						[desperationMoveInfo.damageClass],
						guildEmojis
					);
					formattedDesperationMove = `${rentalPokemonInfo.desperation?.move}  ${desperationMoveTypeEmoji}  ${desperationMoveDamageClassEmoji}`;
					const desperationField = {
						name: "Desperation",
						value: `Uses ${formattedDesperationMove} ${rentalPokemonInfo.desperation?.timing}.`
					};
					embed.addFields(desperationField);
				}

				const addFieldWithCondition = (name, value, condition) => {
					if (condition) {
						embed.addFields({ name: name, value: value });
					}
				};
				addFieldWithCondition(
					"4x Damage From",
					getGuildEmojis(typeRelations.quadruple_damage_from, guildEmojis).join(" "),
					typeRelations.quadruple_damage_from.length > 0
				);
				addFieldWithCondition(
					"2x Damage From",
					getGuildEmojis(typeRelations.double_damage_from, guildEmojis).join(" "),
					typeRelations.double_damage_from.length > 0
				);
				addFieldWithCondition(
					"Neutral Damage From",
					getGuildEmojis(typeRelations.neutral_damage_from, guildEmojis).join(" "),
					typeRelations.neutral_damage_from.length > 0
				);
				addFieldWithCondition(
					"0.5x Damage From",
					getGuildEmojis(typeRelations.half_damage_from, guildEmojis).join(" "),
					typeRelations.half_damage_from.length > 0
				);
				addFieldWithCondition(
					"0.25x Damage From",
					getGuildEmojis(typeRelations.fourth_damage_from, guildEmojis).join(" "),
					typeRelations.fourth_damage_from.length > 0
				);
				addFieldWithCondition(
					"No Damage From",
					getGuildEmojis(typeRelations.no_damage_from, guildEmojis).join(" "),
					typeRelations.no_damage_from.length > 0
				);
				await interaction.editReply({
					embeds: [embed]
				});
			} else {
				await interaction.editReply(`No DA information found for ${pokemon}`);
			}
		} catch (error) {
			console.log(error);
			await interaction.editReply("An error occurred fetching DA info, please try again later");
		}
	}
};

function getGuildEmojis(emojiNames, emojis) {
	return emojiNames.map((type) => {
		const emoji = emojis.find((e) => e.name.toLowerCase() === type.toLowerCase());
		return emoji ? `<:${emoji.name}:${emoji.id}>` : type;
	});
}

async function getRentalPokemonInfo(pokemon) {
	const fs = require("fs");
	const data = JSON.parse(fs.readFileSync("./assets/information/dynamaxAdventuresPokemon.json", "utf8"));
	const rentalPokemonInfo = data.find((p) => p.name.toLowerCase() === pokemon.toLowerCase());
	return rentalPokemonInfo;
}

async function getPokemonSprite(pokemon) {
	const url = API_URLS.POKEMON_SHINY_FORM(pokemon);
	return url;
}

async function getGeneralPokemonInfo(pokemon) {
	const url = API_URLS.POKEMON_INFO(pokemon);
	const response = await axios.get(url);
	const types = response.data.types.map((type) => type.type.name);
	const baseStats = response.data.stats.map((stat) => ({
		name: stat.stat.name,
		value: stat.base_stat
	}));
	const dexNumber = response.data.id;
	const typeRelations = await getTypeRelations(types);
	return { types, baseStats, dexNumber, typeRelations };
}

async function getMoveInfo(move) {
	let moveName = move.replace(" ", "-");
	const url = API_URLS.POKEMON_MOVE_INFO(moveName);
	const response = await axios.get(url);
	const type = response.data.type.name;
	const damageClass = response.data.damage_class.name;
	return { type, damageClass };
}

async function getTypeRelations(types) {
	const typeRelations = {
		quadruple_damage_from: [],
		double_damage_from: [],
		neutral_damage_from: [],
		half_damage_from: [],
		fourth_damage_from: [],
		no_damage_from: []
	};

	try {
		const typeListUrl = API_URLS.POKEMON_TYPE_LIST;
		const typeListResponse = await axios.get(typeListUrl);
		const allTypes = typeListResponse.data.results
			.map((type) => type.name)
			.filter((type) => type !== "unknown" && type !== "stellar");
		await fetchTypeRelations(types, typeRelations, allTypes);
		removeNoDamageTypes(typeRelations);
	} catch (error) {
		console.log(error.message);
	}

	return typeRelations;
}

async function fetchTypeRelations(types, typeRelations, allTypes) {
	for (const type of types) {
		const typeInfoUrl = API_URLS.POKEMON_TYPE_INFO(type);
		const typeInfoResponse = await axios.get(typeInfoUrl);
		const damageRelations = typeInfoResponse.data.damage_relations;
		for (const key of Object.keys(damageRelations)) {
			if (key.endsWith("from")) {
				for (const damageType of damageRelations[key].map((type) => type.name)) {
					processDamageType(key, damageType, typeRelations);
				}
			}
		}
	}

	for (const type of allTypes) {
		if (
			!typeRelations.no_damage_from.includes(type) &&
			!typeRelations.double_damage_from.includes(type) &&
			!typeRelations.half_damage_from.includes(type) &&
			!typeRelations.quadruple_damage_from.includes(type) &&
			!typeRelations.fourth_damage_from.includes(type) &&
			!typeRelations.neutral_damage_from.includes(type)
		) {
			typeRelations.neutral_damage_from.push(type);
		}
	}
}

function processDamageType(key, damageType, typeRelations) {
	if (typeRelations.no_damage_from.includes(damageType)) {
		return;
	}

	if (key === "double_damage_from" && typeRelations.half_damage_from.includes(damageType)) {
		typeRelations.neutral_damage_from.push(damageType);
		typeRelations.half_damage_from = typeRelations.half_damage_from.filter((t) => t !== damageType);
		return;
	}

	if (key === "half_damage_from" && typeRelations.double_damage_from.includes(damageType)) {
		typeRelations.neutral_damage_from.push(damageType);
		typeRelations.double_damage_from = typeRelations.double_damage_from.filter((t) => t !== damageType);
		return;
	}

	if (key === "double_damage_from" && typeRelations.double_damage_from.includes(damageType)) {
		typeRelations.quadruple_damage_from.push(damageType);
		typeRelations.double_damage_from = typeRelations.double_damage_from.filter((t) => t !== damageType);
		return;
	}

	if (key === "half_damage_from" && typeRelations.half_damage_from.includes(damageType)) {
		typeRelations.fourth_damage_from.push(damageType);
		typeRelations.half_damage_from = typeRelations.half_damage_from.filter((t) => t !== damageType);
		return;
	}

	typeRelations[key].push(damageType);
}

function removeNoDamageTypes(typeRelations) {
	const noDamageTypes = new Set(typeRelations.no_damage_from);

	for (const type of noDamageTypes) {
		typeRelations.double_damage_from = typeRelations.double_damage_from.filter((t) => t !== type);
		typeRelations.half_damage_from = typeRelations.half_damage_from.filter((t) => t !== type);
		typeRelations.quadruple_damage_from = typeRelations.quadruple_damage_from.filter((t) => t !== type);
		typeRelations.fourth_damage_from = typeRelations.fourth_damage_from.filter((t) => t !== type);
		typeRelations.neutral_damage_from = typeRelations.neutral_damage_from.filter((t) => t !== type);
	}
}
