import { SlashCommandBuilder, ContainerBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import 'dotenv/config';


export const data = new SlashCommandBuilder().setName('lunch').setDescription('Provide a random restaurant pick!');

export async function execute(interaction, recallApi) {
    try {

        const userId = interaction.user.id;
        const userRecord = recallApi.get(userId);
        const commandName = interaction.commandName;

        if (userRecord && userRecord[commandName] && userRecord[commandName].count > 0) {
            console.log("-------------------------------------------------------------------")
            const commandData = userRecord[commandName];
            const selectedShop = commandData.shops.shift();
            commandData.count = commandData.shops.length;
            const replyEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(selectedShop.displayName.text)
                .setURL(selectedShop.googleMapsUri);

            await interaction.reply({
                embeds: [replyEmbed]
            })

        } else {
            console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")

            await interaction.deferReply();
            const url = 'https://places.googleapis.com/v1/places:searchText';
            const API_KEY = process.env.GOOGLE_API_KEY

            const header = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.types,places.googleMapsUri,places.primaryType,places.businessStatus",
            }
            const area = "会津若松 ランチ";

            const body = {
                "textQuery": area,
                "languageCode": "ja",
                "minRating": 3.0,
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: header,
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                return await interaction.editReply({ content: 'もう一度お試し下さい' });
            }

            const data = await response.json();

            const shops = data.places;
            shops.sort(() => Math.random() - 0.5);
            recallApi.set(userId, commandName, shops);

            const newCommandData = recallApi.get(userId)[commandName];
            const selectedShop = newCommandData.shops.shift();
            newCommandData.count = newCommandData.shops.length;

            const replyEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(selectedShop.displayName.text)
                .setURL(selectedShop.googleMapsUri);

            await interaction.editReply({ embeds: [replyEmbed] });
            return
        }
    } catch (e) {
        console.error(e);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '検索中にエラーが起きました💦', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: '検索中にエラーが起きました💦', flags: MessageFlags.Ephemeral });
        }
    }

}


