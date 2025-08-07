const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.once('ready', async () => {
    console.log(`🤖 ${client.user.tag} is online!`);

    // Check all guilds the bot is in
    for (const guild of client.guilds.cache.values()) {
        console.log(`\n📋 Guild: ${guild.name} (${guild.id})`);

        try {
            const member = await guild.members.fetch(client.user.id);
            console.log(`👤 Bot Member: ${member.user.tag}`);
            console.log(`🆔 Bot ID: ${member.id}`);
            console.log(`📅 Joined: ${member.joinedAt}`);
            console.log(`🎭 Nickname: ${member.nickname || 'None'}`);

            // Check permissions
            const permissions = member.permissions;
            console.log(`🔐 Permissions:`);
            console.log(`  - Send Messages: ${permissions.has(PermissionsBitField.Flags.SendMessages) ? '✅' : '❌'}`);
            console.log(`  - Use Slash Commands: ${permissions.has(PermissionsBitField.Flags.UseApplicationCommands) ? '✅' : '❌'}`);
            console.log(`  - Embed Links: ${permissions.has(PermissionsBitField.Flags.EmbedLinks) ? '✅' : '❌'}`);
            console.log(`  - Read Message History: ${permissions.has(PermissionsBitField.Flags.ReadMessageHistory) ? '✅' : '❌'}`);
            console.log(`  - View Channels: ${permissions.has(PermissionsBitField.Flags.ViewChannel) ? '✅' : '❌'}`);

            // Check if bot is visible
            console.log(`👁️  Bot Visibility: ${member.presence ? 'Online' : 'Offline/Invisible'}`);

        } catch (error) {
            console.error(`❌ Error checking guild ${guild.name}:`, error.message);
        }
    }

    console.log('\n✅ Permission check complete!');
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN); 