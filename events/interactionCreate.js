import { Events, Collection, MessageFlags } from 'discord.js';
import 'dotenv/config';
import { handleSendButton } from '../interactions/sendButton.js';

class ExpiringMap extends Map {
    constructor(timeToAlive, entries) {
        super(entries);
        this.timeToAlive = timeToAlive;
        this._timeouts = new Map();
    }

    set(key, value) {
        if (this._timeouts.has(key)) {
            clearTimeout(this._timeouts.get(key));
        }
        const timeout = setTimeout(() => {
            super.delete(key);
            this._timeouts.delete(key);
        }, this.timeToAlive);
        this._timeouts.set(key, timeout);
        return super.set(key, value);
    }

    delete(key) {
        if (this._timeouts.has(key)) {
            clearTimeout(this._timeouts.get(key));
            this._timeouts.delete(key);
        }
        return super.delete(key);
    }

    clear() {
        for (const timeout of this._timeouts.values()) {
            clearTimeout(timeout);
        }
        this._timeouts.clear();
        return super.clear();
    }
}

const userSelectArea = new ExpiringMap(180_000);

export const name = Events.InteractionCreate;
export async function execute(interaction) {
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

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

    } else if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'area') {
            userSelectArea.set(interaction.user.id, interaction.values[0]);
            await interaction.deferUpdate();
            return;
        }

    } else if (interaction.isButton()) {
        await handleSendButton(interaction, userSelectArea);
    }
}