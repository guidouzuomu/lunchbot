import { Events, Collection, MessageFlags, EmbedBuilder } from 'discord.js';
import 'dotenv/config';


export async function handleSendButton(interaction, userSelectArea) {

    const userSelect = userSelectArea.get(interaction.user.id);

    if (!userSelect) {
        return await interaction.reply('エリアを選択してください');
    }

    if (interaction.customId === 'sendRamen') {
        const urlRamen = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env.API_KEY}&small_area=${userSelect}&format=json&genre=G013`;

        try {
            const response = await fetch(urlRamen);
            if (!response.ok) {
                return await interaction.reply('もう一度お試し下さい');
            }
            const data = await response.json();

            const randomIndex = Math.floor(Math.random() * data.results.shop.length);
            const shopDetail = data.results.shop[randomIndex].shop_detail_memo || '';
            const shopClose = data.results.shop[randomIndex].close || '';

            const replyEmbed = new EmbedBuilder()
                .setAuthor({
                    name: 'Powered by ホットペッパーグルメ Webサービス',
                    url: 'http://webservice.recruit.co.jp/'
                })
                .setColor(0x0099ff)
                .setTitle(data.results.shop[randomIndex].name)
                .setImage(data.results.shop[randomIndex].logo_image)
                .setDescription('定休日:' + shopClose + '\n' + shopDetail)
                .setURL(data.results.shop[randomIndex].urls.pc)
                .setFooter({ text: '画像提供：ホットペッパー グルメ' });

            console.log('\n name:' + data.results.shop[randomIndex].name + '\n shopmemo:' + shopDetail + '\n close:' + shopClose);

            return await interaction.reply({
                embeds: [replyEmbed]
            })
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: '検索中にエラーが起きました💦', flags: MessageFlags.Ephemeral });
        }
    }

    else if (interaction.customId === 'send') {

        const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env.API_KEY}&small_area=${userSelect}&format=json`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                return await interaction.reply('もう一度お試し下さい');
            }
            const data = await response.json();

            const randomIndex = Math.floor(Math.random() * data.results.shop.length);
            const shopDetail = data.results.shop[randomIndex].shop_detail_memo || '';
            const shopClose = data.results.shop[randomIndex].close || '';

            const replyEmbed = new EmbedBuilder()
                .setAuthor({
                    name: 'Powered by ホットペッパーグルメ Webサービス',
                    url: 'http://webservice.recruit.co.jp/'
                })
                .setColor(0x0099ff)
                .setTitle(data.results.shop[randomIndex].name)
                .setImage(data.results.shop[randomIndex].logo_image)
                .setDescription('定休日:' + shopClose + '\n' + shopDetail)
                .setURL(data.results.shop[randomIndex].urls.pc)
                .setFooter({ text: '画像提供：ホットペッパー グルメ' });

            console.log('\n name:' + data.results.shop[randomIndex].name + '\n shopmemo:' + shopDetail + '\n close:' + shopClose);

            await interaction.reply({
                embeds: [replyEmbed]
            })

            return;

        } catch (e) {
            console.error(e);
            await interaction.reply({ content: '検索中にエラーが起きました💦', flags: MessageFlags.Ephemeral });
        }
    }
}

