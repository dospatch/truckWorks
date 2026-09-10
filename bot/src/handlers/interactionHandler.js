const { handleSelectMenu } = require("./selectMenuHandler");
const { handleModal } = require("./modalHandler");
const { handleButton } = require("./buttonHandler");

async function handleInteraction(interaction) {
    if (interaction.isStringSelectMenu()) {
        return handleSelectMenu(interaction);
    }

    if (interaction.isModalSubmit()) {
        return handleModal(interaction);
    }

    if (interaction.isButton()) {
        return handleButton(interaction);
    }
}

module.exports = {
    handleInteraction
};
