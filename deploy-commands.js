const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'ask',
        description: 'Ask the AI assistant a question',
        options: [
            {
                name: 'question',
                description: 'The question you want to ask the AI',
                type: 3, // STRING type
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})(); 