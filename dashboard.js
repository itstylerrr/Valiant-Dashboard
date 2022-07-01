function init(client) {
    const config = require('./config.json');
    const DarkDashboard = require('dbd-dark-dashboard');
    const DBD = require("discord-dashboard");
    const mongoose = require("mongoose");
    const guildSchema = require("./Database/Schemas/Guild");
    let langsSettings = {};
    let prefixData = {};

    const totalUsers = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    const usersWord = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
        ? "users"
        : "user";
    const totalGuilds = client.guilds.cache.size;
    const guildsWord = client.guilds.cache.size > 1 ? "servers" : "server";

    mongoose.connect(config.mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((err) => {
        console.log(`Mongo Error: ${err}`);
    });

    /* --- DASHBOARD --- */
    (async () => {
        let DBD = require('discord-dashboard');
        await DBD.useLicense(config.dbd_lic);
        DBD.Dashboard = DBD.UpdatedClass();

        const Dashboard = new DBD.Dashboard({
            port: 80,
            client: {
                id: config.client_id,
                secret: config.client_secret
            },
            redirectUri: config.redirect_uri,
            domain: 'http://localhost',
            bot: client,
            theme: DarkDashboard({
                information: {
                    createdBy: "Greezy Development",
                    websiteTitle: "Valiant",
                    websiteName: "Valiant",
                    websiteUrl: "http://localhost",
                    dashboardUrl: "http://localhost:3000/",
                    supporteMail: "support@imidnight.ml",
                    supportServer: "https://discord.gg/a7V6C4dAQj",
                    imageFavicon: "https://docs.google.com/drawings/d/e/2PACX-1vSnKAiuOYUjIz30bN85bJiaHrZ31dx0qvgxDY840hg02UlxCAzPIMxMFKETwrb9B1sYVnav2wzqr_gJ/pub?w=304&h=311",
                    iconURL: "https://docs.google.com/drawings/d/e/2PACX-1vSnKAiuOYUjIz30bN85bJiaHrZ31dx0qvgxDY840hg02UlxCAzPIMxMFKETwrb9B1sYVnav2wzqr_gJ/pub?w=304&h=311",
                    loggedIn: "Successfully signed in.",
                    mainColor: "#2CA8FF",
                    subColor: "#ebdbdb",
                    preloader: "Loading..."
                },

                invite: {
                    clientId: "990376052813615115",
                    permissions: '8',
                    redirectUri: "http://localhost/discord/callback",
                    scopes: ["bot", "application.commands", "guilds"],
                },

                index: {
                    card: {
                        category: "Valiant's Panel - The center of everything",
                        title: `Welcome to Valiant... A multipurpose discord bot that can do whatever you dream of, almost...`,
                        image: "https://docs.google.com/drawings/d/e/2PACX-1vS2QIenk9jw5iT_thON1kA8rLl-rX_OUFYlp0yKFc_f_wxw1wn1tMW7T_8eKI5WAtqAlw9_Cjf-166m/pub?w=927&h=178",
                        footer: "To get started, just sign in using your discord account!",
                    },

                    information: {
                        category: "Bot Information",
                        title: "Information",
                        description: `Valiant is trusted by many users and guilds. We have a total of ${totalUsers} ${usersWord} throughout ${totalGuilds} ${guildsWord}.`,
                        footer: "To invite the bot, just log in and select a server you want the bot to join!",
                    },

                    feeds: {
                        category: "Category",
                        title: "Information",
                        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                        footer: "Footer",
                    },
                },

                commands: [
                    {
                        category: `Starting Up`,
                        subTitle: `All helpful commands`,
                        list: [{
                            commandName: 'bug',
                            commandUsage: `;bug <bug>`,
                            commandDescription: `test`,
                            commandAlias: 'No aliases'
                        },
                        {
                            commandName: "2nd command",
                            commandUsage: "oto.nd <arg> <arg2> [op]",
                            commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff",
                            commandAlias: "Alias",
                        },
                        {
                            commandName: "Test command",
                            commandUsage: "prefix.test <arg> [op]",
                            commandDescription: "Lorem ipsum dolor sth",
                            commandAlias: "Alias",
                        },
                        ],
                    },
                ],
            }),
            settings: [
                {
                    categoryId: 'setup',
                    categoryName: "Setup",
                    categoryDescription: "Setup your bot with default settings!",
                    categoryOptionsList: [
                        {
                            optionId: 'lang',
                            optionName: "Language",
                            optionDescription: "Change bot's language easily",
                            optionType: DBD.formTypes.select({ "English": 'en', "Polish": 'pl', "French": 'fr' }),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                langsSettings[guild.id] = data.test;
                                return langsSettings[guild.id] || null;
                            },
                            setNew: async ({ guild, newData }) => {

                                langsSettings[guild.id] = newData;
                                await guildSchema.findOneAndUpdate({
                                    id: guild.id
                                },
                                    {
                                        test: newData,
                                    });
                                return;
                            }
                        },

                        {
                            optionId: 'prefix',
                            optionName: "Prefix",
                            optionDescription: "Set bot prefix.",
                            optionType: DBD.formTypes.input('Prefix', 1, 4, false, false), // reqired false (if empty reset to default)
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.prefix;
                            },
                            setNew: async ({ guild, newData }) => {
                                await guildSchema.findOneAndUpdate(
                                    {
                                        id: guild.id
                                    },
                                    {
                                        prefix: newData
                                    }
                                );
                                prefixData[guild.id] = newData || '!';
                                return;
                            }
                        },
                    ]
                },

                {
                    categoryId: "wlcmgdbymsgs",
                    categoryName: "Welcome and Goodbye Settings",
                    categoryDescription: "Configure the welcome and goodbye settings and message for the guild.",
                    categoryOptionsList: [
                        {
                            optionType: 'spacer',
                            title: 'Welcome Message Configuration',
                            description: 'This is the section where you can edit all of the welcome message options and embeds. Continue scrolling to get to the goodbye messages area.'
                        },
                        {
                            optionId: 'switch_welcomeToggle',
                            optionName: "Toggle Welcome Message",
                            optionDescription: "Toggle the welcome system on and off.",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({  id: guild.id });
                                const SAVED_STATE = data.addons.welcome.enabled;
                                const DEFAULT_STATE = false;
                                return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.welcome.enabled = newData;
                                await data.markModified("addons.welcome");
                                await data.save();
                                return;
                            },
                        },
                        {
                            optionId: 'welcome_channel',
                            optionName: "Welcome Channel",
                            optionDescription: "Select the channel where welcome messaegs should be sent.",
                            optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                            getActualSet: async ({guild}) => {
                                const data = await guildSchema.findOne({  id: guild.id });
                                return data.addons.welcome.channel;
                            },
                            setNew: async ({guild,newData}) => {
                                const data = await guildSchema.findOne({  id: guild.id });
                                data.addons.welcome.channel = newData;
                                await data.markModified("addons.welcome");
                                await data.save();
                                return;
                            }
                        },
                        {
                            optionId: 'welcome_embed',
                            optionName: "Welcome Embed",
                            optionDescription: "Build your own Welcome Embed!",
                            optionType: DBD.formTypes.embedBuilder({
                                username: client.user.username,
                                avatarURL: client.user.avatarURL({ dynamic: true }),
                                defaultJson: {
                                    content: "Do you want to ping the user that just joined? Try puting {user.ping} here!",
                                    embed: {
                                        timestamp: new Date().toISOString(),
                                        url: "https://discord.com",
                                        description: "There was a boar, everyone liked a boar. One day the boar ate my dinner and escaped through the chimney. I haven't seen a boar since then.",
                                        author: {
                                            name: "Welcome to {guild.name}",
                                            url: "https://assistantscenter.com",
                                            icon_url: "https://media.discordapp.net/attachments/911644960590270484/934513385402413076/ac_fixed.png"
                                        },
                                        image: {
                                            url: "https://unsplash.it/380/200"
                                        },
                                        footer: {
                                            text: "Crated with Discord-Dashboard",
                                            icon_url: "https://cdn.discordapp.com/emojis/870635912437047336.png"
                                        },
                                        fields: [
                                            {
                                                name: "Hello",
                                                value: "Whats up dog? <:ac_love:806492057996230676>"
                                            },
                                            {
                                                name: "Do you know that",
                                                value: "You can use custom emojis there, even from server where bot isn't :Kekwlaugh:",
                                                inline: false
                                            },
                                        ]
                                    }
                                }
                            }),
                            getActualSet: async ({ guild }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                return data.addons.welcome.json || null;
                            },
                            setNew: async ({ guild, newData }) => {
                                const data = await guildSchema.findOne({ id: guild.id });
                                data.addons.welcome.json = newData || null;
                                await data.markModified("addons.welcome");
                                await data.save();
                                return;
                            }
                        },
                    ]
                }
            ]
        });
        Dashboard.init();
    })();
}

module.exports.init = init;