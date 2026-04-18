import { SlashCommandBuilder, ContainerBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, EmbedBuilder } from 'discord.js';
import 'dotenv/config';



export const data = new SlashCommandBuilder().setName('ramen').setDescription('Provide a random ramen pick!');

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
                "X-Goog-FieldMask": "places.displayName,places.googleMapsUri,nextPageToken",
            }
            const area = "会津若松 ラーメン";

            const body = {
                "textQuery": area,
                "languageCode": "ja",
                "minRating": 3.0,
            }

            if (userRecord && userRecord[commandName] && userRecord[commandName].nextPageToken) {
                console.log(1);

                const token = userRecord.ramen.nextPageToken;
                body.pageToken = token;
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
            // console.log(data);

            const shops = data.places;
            const nextPageToken = data.nextPageToken;
            shops.sort(() => Math.random() - 0.5);
            recallApi.set(userId, commandName, shops, nextPageToken);

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


