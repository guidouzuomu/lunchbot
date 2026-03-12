import { Events, Collection, MessageFlags } from 'discord.js';

export const name=Events.InteractionCreate;
    export async function  execute(interaction) {
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
            // } else if (interaction.isStringSelectMenu()) {
            //     if (interaction.customId === 'starter') {
            //         await interaction.reply({ content: 'Your submission was received successfully!' });
            //         const starter = interaction.values[0];
            //         console.log({ starter });


            //     }
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
        }
    }
