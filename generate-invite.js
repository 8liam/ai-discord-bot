require('dotenv').config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!CLIENT_ID) {
    console.error('❌ DISCORD_CLIENT_ID not found in .env file');
    process.exit(1);
}

// Generate invite URL with necessary permissions
const permissions = [
    'SendMessages',           // Send messages in channels
    'UseApplicationCommands', // Use slash commands
    'EmbedLinks',            // Send embeds
    'ReadMessageHistory',    // Read message history
    'ViewChannel'            // View channels
];

const permissionBits = permissions.map(perm => {
    const permissionMap = {
        'SendMessages': 0x0000000000000800,
        'UseApplicationCommands': 0x0000000000008000,
        'EmbedLinks': 0x0000000000004000,
        'ReadMessageHistory': 0x0000000000004000,
        'ViewChannel': 0x0000000000000400
    };
    return permissionMap[perm] || 0;
}).reduce((a, b) => a | b, 0);

const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=${permissionBits}&scope=bot%20applications.commands`;

console.log('🔗 Bot Invite URL:');
console.log(inviteUrl);
console.log('\n📋 Required Permissions:');
permissions.forEach(perm => console.log(`  ✅ ${perm}`));
console.log('\n💡 Copy and paste this URL into your browser to invite the bot to your server!'); 