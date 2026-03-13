import { SlashCommandBuilder, ContainerBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import fs from 'fs';
import 'dotenv/config';


export const data = new SlashCommandBuilder().setName('lunch').setDescription('Provide a random restaurant pick!');

export async function execute(interaction) {
    const container = new ContainerBuilder()
        .setAccentColor(0x0099ff)
        .addTextDisplayComponents((textDisplay) =>
            textDisplay.setContent(
                'エリアを選択してください'
            ),
        )
        .addActionRowComponents((actionRow) =>
            actionRow.addComponents(new StringSelectMenuBuilder()
                .setCustomId('area')
                .setPlaceholder('エリアを選択してください')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('駅周辺')
                        .setDescription('aaa')
                        .setValue('X949'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('駅以外')
                        .setDescription('bbb')
                        .setValue('XLI5'),
                )
            ),
        )
        .addSeparatorComponents((separator) => separator)
        .addSectionComponents((section) =>
            section
                .addTextDisplayComponents((textDisplay) =>
                    textDisplay.setContent('discription')
                )
                .setButtonAccessory((button) =>
                    button.setCustomId('send').setLabel('送信').setStyle(ButtonStyle.Primary),
                ),
        )

    await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });
}


