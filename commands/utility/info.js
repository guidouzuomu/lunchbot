import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or a server!')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('user')
            .setDescription('Info about a user')
            .addUserOption((option) => option.setName('target').setDescription('The user')),
    )
    .addSubcommand((subcommand) => subcommand.setName('server').setDescription('Info about the server'));

export async function execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'user') {
        const user = interaction.options.getUser('target') ?? interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        await interaction.reply(`This command was run by ${user.username}, who joined on ${member.joinedAt}.`);

    }
    if (sub === 'server') {
        await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
    }
}