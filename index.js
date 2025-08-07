const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { REST, Routes } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

// Command collection
client.commands = new Collection();

// Load system prompt
function loadSystemPrompt() {
    try {
        const systemPromptPath = path.join(__dirname, 'system-prompt.xml');
        const systemPromptContent = fs.readFileSync(systemPromptPath, 'utf8');

        // Extract the text content from XML tags
        const roleMatch = systemPromptContent.match(/<role>(.*?)<\/role>/s);
        const guidelinesMatch = systemPromptContent.match(/<guidelines>(.*?)<\/guidelines>/s);
        const limitationsMatch = systemPromptContent.match(/<limitations>(.*?)<\/limitations>/s);
        const formattingMatch = systemPromptContent.match(/<discord-specific>(.*?)<\/discord-specific>/s);

        let systemPrompt = '';
        if (roleMatch) systemPrompt += roleMatch[1].trim() + '\n\n';
        if (guidelinesMatch) systemPrompt += 'Guidelines:\n' + guidelinesMatch[1].trim() + '\n\n';
        if (limitationsMatch) systemPrompt += 'Limitations:\n' + limitationsMatch[1].trim() + '\n\n';
        if (formattingMatch) systemPrompt += 'Formatting:\n' + formattingMatch[1].trim();

        return systemPrompt.trim();
    } catch (error) {
        console.error('Error loading system prompt:', error);
        return 'You are a helpful AI assistant integrated into a Discord bot. Provide accurate, informative, and engaging responses to user questions.';
    }
}

// OpenRouter API function
async function askOpenRouter(question, systemPrompt) {
    try {
        const response = await axios.post(
            `${process.env.OPENROUTER_BASE_URL}/v1/chat/completions`,
            {
                model: process.env.DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                max_tokens: parseInt(process.env.MAX_TOKENS) || 1000,
                temperature: parseFloat(process.env.TEMPERATURE) || 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://liamgrant.com',
                    'X-Title': 'AI Discord Bot'
                }
            }
        );

        console.log('OpenRouter Response:', JSON.stringify(response.data, null, 2));

        if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
            throw new Error('Invalid response structure from OpenRouter API');
        }

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenRouter API Error:', error.response?.data || error.message);
        throw new Error('Failed to get response from AI service');
    }
}

// Slash command handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ask') {
        const question = interaction.options.getString('question');

        if (!question) {
            await interaction.reply({ content: 'Please provide a question!', ephemeral: true });
            return;
        }

        // Defer the reply since AI responses can take time
        await interaction.deferReply();

        try {
            const systemPrompt = loadSystemPrompt();
            const aiResponse = await askOpenRouter(question, systemPrompt);

            // Create an embed for the response
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${question}`)
                .setDescription(aiResponse)
                .setFooter({ text: `Asked by ${interaction.user.username}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error processing ask command:', error);
            await interaction.editReply({
                content: `Sorry, couldn't answer '${question}'. Please try again later.`,
                ephemeral: false
            });
        }
    }
});

// Bot ready event
client.once('ready', () => {
    console.log(`🤖 Bot Name: ${client.user.username}`);
    console.log(`🆔 Bot ID: ${client.user.id}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guilds`);

    // Log guild information for debugging
    if (client.guilds.cache.size > 0) {
        console.log('📋 Connected to guilds:');
        client.guilds.cache.forEach(guild => {
            console.log(`  - ${guild.name} (${guild.id})`);
        });
    } else {
        console.log('⚠️  Bot is not connected to any guilds yet. Please invite it to your server.');
    }

    // Set bot presence after a short delay to avoid shard issues
    setTimeout(() => {
        try {
            client.user.setPresence({
                activities: [{ name: '/ask for AI help', type: 3 }], // 3 = Watching
                status: 'online',
            });
            console.log('✅ Bot presence set successfully');
        } catch (error) {
            console.log('⚠️  Could not set bot presence (this is normal):', error.message);
        }
    }, 2000);
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN); 