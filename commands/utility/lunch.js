import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import 'dotenv/config';


export const data = new SlashCommandBuilder().setName('lunch').setDescription('Provide a random restaurant pick!');

export async function execute(interaction) {
    await interaction.reply('検索中');
    const address = '福島県会津若松市'
    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env.API_KEY}&address=${encodeURIComponent(address)}&format=json`
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results);
    const randomIndex=Math.floor(Math.random() * data.results.shop.length);
    console.log(data.results.shop[randomIndex].name);
    await interaction.editReply(`${data.results.shop[randomIndex].name}`)
}


