import { SlashCommandBuilder, ContainerBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, MessageFlags,EmbedBuilder } from 'discord.js';
import 'dotenv/config';



export const data = new SlashCommandBuilder().setName('ramen').setDescription('Provide a random ramen pick!');

export async function execute(interaction) {
    try {
        const url = 'https://places.googleapis.com/v1/places:searchText';
        const API_KEY = process.env.GOOGLE_API_KEY

        const header = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.types,places.googleMapsUri,places.primaryType,places.businessStatus,nextPageToken",
        }
        const area = "会津若松 ラーメン";

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
            return await interaction.reply('もう一度お試し下さい');
        }
        const data = await response.json();

        const randomIndex = Math.floor(Math.random() * data.places.length);

        const replyEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(data.places[randomIndex].displayName.text)
            .setURL(data.places[randomIndex].googleMapsUri);

        await interaction.reply({
            embeds: [replyEmbed]
        })
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '検索中にエラーが起きました💦', flags: MessageFlags.Ephemeral });
    }
}


