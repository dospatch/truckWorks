const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const {
    getApplicationRequirements
} = require("../config/applicationRequirements");

const staffRequirements =
    getApplicationRequirements("staff");

const QUESTIONS =
    staffRequirements?.applicationQuestions || [];

const REVIEW_CHANNEL_NAME =
    "staff-application-review";

const activeApplications = new Map();

function createStartButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("staff_application_start")
            .setLabel("Start Application")
            .setEmoji("📝")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("staff_application_cancel")
            .setLabel("Cancel")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary)
    );
}

function createConfirmationButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("staff_application_submit")
            .setLabel("Submit Application")
            .setEmoji("✅")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("staff_application_cancel")
            .setLabel("Cancel")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Danger)
    );
}

function createApplicationPanel() {
    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🛠️ BC TRUCKING WORKS Staff Applications")
        .setDescription(
            "Interested in joining the **BC TRUCKING WORKS Staff Team**?\n\n" +
            "Click the button below to begin your staff application.\n\n" +
            "📋 **Application Process**\n" +
            "• Application is completed privately through Discord DMs\n" +
            "• Questions are asked one at a time\n" +
            "• Be honest and provide complete answers\n" +
            "• Applications are reviewed by Management\n" +
            "• Submission does not guarantee acceptance\n\n" +
            "📝 **Ready to apply?**\n" +
            "Click **Apply for Staff** below."
        )
        .setFooter({
            text: "BC TRUCKING WORKS • Staff Recruitment"
        })
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("staff_application_apply")
            .setLabel("Apply for Staff")
            .setEmoji("📝")
            .setStyle(ButtonStyle.Primary)
    );

    return {
        embeds: [embed],
        components: [row]
    };
}

async function ensureReviewChannel(guild) {
    let channel = guild.channels.cache.find(
        c =>
            c.type === ChannelType.GuildText &&
            c.name === REVIEW_CHANNEL_NAME
    );

    if (channel) {
        return channel;
    }

    const managementRole = guild.roles.cache.find(
        role =>
            role.name.toLowerCase() === "management"
    );

    const permissionOverwrites = [
        {
            id: guild.roles.everyone.id,
            deny: [
                PermissionFlagsBits.ViewChannel
            ]
        }
    ];

    if (managementRole) {
        permissionOverwrites.push({
            id: managementRole.id,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory
            ]
        });
    }

    if (guild.members.me) {
        permissionOverwrites.push({
            id: guild.members.me.id,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageMessages
            ]
        });
    }

    channel = await guild.channels.create({
        name: REVIEW_CHANNEL_NAME,
        type: ChannelType.GuildText,
        topic: "Private BC TRUCKING WORKS Staff Application Review",
        permissionOverwrites
    });

    return channel;
}

async function sendApplicationPanel(guild) {
    const channel = guild.channels.cache.find(
        c =>
            c.type === ChannelType.GuildText &&
            c.name.toLowerCase().replace(/[-_]/g, "") ===
                "serverapplications"
    );

    if (!channel) {
        return {
            success: false,
            reason: "SERVER_APPLICATIONS_NOT_FOUND"
        };
    }

    const payload = createApplicationPanel();

    const messages = await channel.messages.fetch({
        limit: 50
    });

    const existing = messages.find(
        message =>
            message.author.id === guild.client.user.id &&
            message.embeds.length > 0 &&
            message.embeds[0].title?.includes(
                "BC TRUCKING WORKS Staff Applications"
            )
    );

    if (existing) {
        await existing.edit(payload);

        return {
            success: true,
            action: "updated",
            messageId: existing.id
        };
    }

    const message = await channel.send(payload);

    return {
        success: true,
        action: "created",
        messageId: message.id
    };
}

async function startApplication(user, guild) {
    if (activeApplications.has(user.id)) {
        const dm = await user.createDM();

        await dm.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle("⚠️ Application Already Started")
                    .setDescription(
                        "You already have a staff application in progress.\n\n" +
                        "Please finish your current application before starting another one."
                    )
                    .setTimestamp()
            ]
        });

        return;
    }

    const dm = await user.createDM();

    activeApplications.set(user.id, {
        userId: user.id,
        guildId: guild.id,
        currentQuestion: 0,
        answers: {},
        started: false,
        awaitingConfirmation: false,
        createdAt: Date.now()
    });

    await dm.send({
        embeds: [
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("🛠️ BC TRUCKING WORKS Staff Application")
                .setDescription(
                    `Welcome, **${user.username}**!\n\n` +
                    "Thank you for your interest in joining the **BC TRUCKING WORKS Staff Team**.\n\n" +
                    "Before beginning:\n" +
                    "• Answer every question honestly\n" +
                    "• Take your time\n" +
                    "• Do not submit false information\n" +
                    "• You may cancel at any time\n" +
                    "• Your application will be reviewed by Management\n\n" +
                    "Click **Start Application** when you're ready."
                )
                .setFooter({
                    text: "BC TRUCKING WORKS • Staff Recruitment"
                })
                .setTimestamp()
        ],
        components: [createStartButtons()]
    });
}

async function beginQuestions(interaction) {
    const user = interaction.user;

    const application = activeApplications.get(user.id);

    if (!application) {
        await interaction.reply({
            content:
                "❌ You do not have an active staff application. Please click **Apply for Staff** again."
        });

        return;
    }

    if (application.started) {
        await interaction.reply({
            content:
                "⚠️ Your staff application has already started."
        });

        return;
    }

    /*
     * IMPORTANT:
     * DM button interactions must be acknowledged normally.
     * Do NOT use an ephemeral response here.
     */
    await interaction.deferUpdate();

    application.started = true;

    await sendCurrentQuestion(user);
}

async function sendCurrentQuestion(user) {
    const application = activeApplications.get(user.id);

    if (!application) {
        return;
    }

    const question =
        QUESTIONS[application.currentQuestion];

    if (!question) {
        await finishApplication(user);
        return;
    }

    const questionNumber =
        application.currentQuestion + 1;

    const totalQuestions = QUESTIONS.length;

    const questionText =
        question.question ||
        question.prompt ||
        question.label ||
        `Question ${questionNumber}`;

    const dm = await user.createDM();

    await dm.send({
        embeds: [
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(
                    `📝 Staff Application — Question ${questionNumber}/${totalQuestions}`
                )
                .setDescription(
                    `${questionText}\n\n` +
                    "💬 **Reply to this message with your answer.**\n\n" +
                    "Type `cancel` at any time to cancel your application."
                )
                .setFooter({
                    text: "BC TRUCKING WORKS • Staff Application"
                })
                .setTimestamp()
        ]
    });
}

async function handleDMMessage(message) {
    if (message.author.bot) {
        return;
    }

    if (message.guild) {
        return;
    }

    const application =
        activeApplications.get(message.author.id);

    if (!application) {
        return;
    }

    if (!application.started) {
        return;
    }

    if (application.awaitingConfirmation) {
        return;
    }

    const content =
        message.content.trim();

    if (!content) {
        return;
    }

    if (content.toLowerCase() === "cancel") {
        activeApplications.delete(message.author.id);

        await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle("❌ Application Cancelled")
                    .setDescription(
                        "Your staff application has been cancelled.\n\n" +
                        "You can start a new application from the **server-applications** channel whenever you're ready."
                    )
                    .setTimestamp()
            ]
        });

        return;
    }

    const question =
        QUESTIONS[application.currentQuestion];

    const key =
        question?.id ||
        question?.key ||
        `question_${application.currentQuestion + 1}`;

    application.answers[key] = content;

    application.currentQuestion++;

    if (
        application.currentQuestion >=
        QUESTIONS.length
    ) {
        await finishApplication(message.author);
        return;
    }

    await sendCurrentQuestion(message.author);
}

async function finishApplication(user) {
    const application =
        activeApplications.get(user.id);

    if (!application) {
        return;
    }

    application.awaitingConfirmation = true;

    const fields = [];

    QUESTIONS.forEach((question, index) => {
        const key =
            question?.id ||
            question?.key ||
            `question_${index + 1}`;

        const answer =
            application.answers[key] ||
            "No answer provided";

        fields.push({
            name:
                question?.question ||
                question?.prompt ||
                question?.label ||
                `Question ${index + 1}`,
            value:
                answer.length > 1024
                    ? answer.substring(0, 1021) + "..."
                    : answer
        });
    });

    const dm = await user.createDM();

    const embed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setTitle("📋 Review Your Staff Application")
        .setDescription(
            "You have reached the end of the application.\n\n" +
            "Please review your answers below before submitting."
        )
        .addFields(fields)
        .setFooter({
            text: "BC TRUCKING WORKS • Final Review"
        })
        .setTimestamp();

    await dm.send({
        embeds: [embed],
        components: [createConfirmationButtons()]
    });
}

async function submitApplication(interaction) {
    const user = interaction.user;

    const application =
        activeApplications.get(user.id);

    if (!application) {
        await interaction.reply({
            content:
                "❌ You do not have an active staff application."
        });

        return;
    }

    if (!application.awaitingConfirmation) {
        await interaction.reply({
            content:
                "⚠️ Your application is not ready to be submitted yet."
        });

        return;
    }

    /*
     * DM interactions cannot use ephemeral responses.
     */
    await interaction.deferUpdate();

    try {
        const guild =
            interaction.client.guilds.cache.get(
                application.guildId
            );

        if (!guild) {
            await interaction.followUp({
                content:
                    "❌ I could not locate the TruckWorks server. Please contact Management."
            });

            return;
        }

        const reviewChannel =
            await ensureReviewChannel(guild);

        const fields = [];

        QUESTIONS.forEach((question, index) => {
            const key =
                question?.id ||
                question?.key ||
                `question_${index + 1}`;

            const answer =
                application.answers[key] ||
                "No answer provided";

            fields.push({
                name:
                    question?.question ||
                    question?.prompt ||
                    question?.label ||
                    `Question ${index + 1}`,
                value:
                    answer.length > 1024
                        ? answer.substring(0, 1021) + "..."
                        : answer
            });
        });

        const applicationEmbed =
            new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(
                    "🛠️ New Staff Application"
                )
                .setDescription(
                    `A new BC TRUCKING WORKS Staff Application has been submitted by <@${user.id}>.`
                )
                .addFields(
                    {
                        name: "Applicant",
                        value:
                            `<@${user.id}>\n${user.username}`
                    },
                    {
                        name: "Applicant ID",
                        value: user.id
                    },
                    ...fields
                )
                .setFooter({
                    text:
                        "BC TRUCKING WORKS • Staff Applications"
                })
                .setTimestamp();

        await reviewChannel.send({
            content:
                "📋 **New Staff Application — Management Review Required**",
            embeds: [applicationEmbed]
        });

        activeApplications.delete(user.id);

        await interaction.editReply({
            content:
                "✅ **Application Submitted Successfully!**\n\n" +
                "Your staff application has been sent to BC TRUCKING WORKS Management for review.\n\n" +
                "Please wait for a response from the Management Team.",
            components: []
        });
    } catch (error) {
        console.error(
            "[STAFF APPLICATION SUBMIT ERROR]",
            error
        );

        await interaction.editReply({
            content:
                "❌ Something went wrong while submitting your application. Please contact Management.",
            components: []
        });
    }
}

async function cancelApplication(interaction) {
    activeApplications.delete(
        interaction.user.id
    );

    await interaction.update({
        content:
            "❌ **Staff application cancelled.**\n\n" +
            "You can start a new application from the TruckWorks server whenever you're ready.",
        embeds: [],
        components: []
    });
}

async function handleButton(interaction) {
    if (!interaction.isButton()) {
        return false;
    }

    const id = interaction.customId;

    if (
        !id.startsWith("staff_application_")
    ) {
        return false;
    }

    try {
        switch (id) {
            case "staff_application_apply": {
                /*
                 * This button is in the server.
                 * Ephemeral is valid here.
                 */
                await interaction.deferReply({
                    ephemeral: true
                });

                try {
                    await startApplication(
                        interaction.user,
                        interaction.guild
                    );

                    await interaction.editReply({
                        content:
                            "📩 **Check your Discord DMs!**\n\n" +
                            "Your staff application has been started privately."
                    });
                } catch (error) {
                    console.error(
                        "[STAFF APPLICATION START ERROR]",
                        error
                    );

                    await interaction.editReply({
                        content:
                            "❌ I couldn't send you a DM. Please make sure your Discord DMs are open for this server."
                    });
                }

                return true;
            }

            case "staff_application_start":
                await beginQuestions(interaction);
                return true;

            case "staff_application_submit":
                await submitApplication(interaction);
                return true;

            case "staff_application_cancel":
                await cancelApplication(interaction);
                return true;

            default:
                return false;
        }
    } catch (error) {
        console.error(
            "[STAFF APPLICATION BUTTON ERROR]",
            error
        );

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content:
                    "❌ Something went wrong while processing the application."
            }).catch(() => {});
        }

        return true;
    }
}

module.exports = {
    handleButton,
    handleDMMessage,
    sendApplicationPanel,
    ensureReviewChannel
};
