import { Events, Collection, MessageFlags, EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder, ContainerBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import fs from 'fs';
import 'dotenv/config';

const userSelectArea = new Map();

export const name = Events.InteractionCreate;
export async function execute(interaction) {
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // if (interaction.isAutocomplete()) {
        //     if (!command) {
        //         console.error(`No command matching ${interaction.commandName} was found.`);
        //         return;
        //     }
        //     try {
        //         await command.autocomplete(interaction);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }

        // if (interaction.isUserContextMenuCommand()) {
        //     // ここでコマンドを呼び出す
        // }

        const { cooldowns } = interaction.client;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1_000);
                return interaction.reply({
                    content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }


        // } else if (interaction.isModalSubmit()) {
        //     if (interaction.customId === 'myModal') {
        //         await interaction.reply({ content: 'Your submission was received successfully!' });
        //         // Get the data entered by the user
        //         // const pong=interaction.fields.getTextInputValue('pong');
        //         // const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
        //         const starter = interaction.fields.getStringSelectValues('starter');
        //         // const picture = interaction.fields.getUploadedFiles('picture');
        //         // console.log({ pong,hobbies, starter, picture });
        //         console.log({ starter });

        //     }
    } else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'area') {
            userSelectArea.set(interaction.user.id, interaction.values[0]);
            await interaction.deferUpdate();
            console.log(interaction.values[0]);
            return;
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'send') {
            const userSelect = userSelectArea.get(interaction.user.id);

            if (!userSelect) {
                return await interaction.reply('エリアを選択してください');
            }


            const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env.API_KEY}&small_area=${userSelect}&format=json`;

            const response = await fetch(url);
            const data = await response.json();

            const randomIndex = Math.floor(Math.random() * data.results.shop.length);
            const description1 = data.results.shop[randomIndex].shop_detail_memo || '';
            const description2 = data.results.shop[randomIndex].close || '';

            const description = description1 + description2;
            const replyEmbed = new EmbedBuilder()
                .setAuthor({
                    name: 'Powered by ホットペッパーグルメ Webサービス',
                    url: 'http://webservice.recruit.co.jp/'
                })
                .setColor(0x0099ff)
                .setTitle(data.results.shop[randomIndex].name)
                .setImage(data.results.shop[randomIndex].logo_image)
                .setDescription('定休日:' + data.results.shop[randomIndex].close + '\n' + data.results.shop[randomIndex].shop_detail_memo)
                .setURL(data.results.shop[randomIndex].urls.pc)
                .setFooter({ text: '画像提供：ホットペッパー グルメ' });

            console.log('name:' + data.results.shop[randomIndex].name + '\n shopmemo:' + data.results.shop[randomIndex].shop_detail_memo +
                '\n close:' + data.results.shop[randomIndex].close
            );

            await interaction.reply({
                embeds: [replyEmbed]
            })
        }
    }
}
// }else if (interaction.isUserSelectMenu()) {
//     if (interaction.customId === 'users') {
//         // 選択されたユーザーたちのIDを取得
//         const userIds = interaction.values;
//         // メンション形式にして表示
//         const mentions = userIds.map(id => `<@${id}>`).join(', ');

//         await interaction.reply({
//             content: `選択されたユーザー: ${mentions}`,
//             flags: MessageFlags.Ephemeral
//         });
//     }
// }

