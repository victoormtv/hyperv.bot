const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const config = require("../data/config");

const bypassUsersPath = path.join(__dirname, "../data/freebypass.json");
const keysFilePath = path.join(__dirname, "../data/bypass_keys.json");

function loadBypassUsers() {
    return JSON.parse(fs.readFileSync(bypassUsersPath, "utf-8"));
}

function saveBypassUsers(data) {
    fs.writeFileSync(bypassUsersPath, JSON.stringify(data, null, 2));
}

function getKeyFromJson() {
    if (!fs.existsSync(keysFilePath)) return null;
    const keysData = JSON.parse(fs.readFileSync(keysFilePath, "utf-8"));
    if (!keysData.keys || keysData.keys.length === 0) return null;
    const key = keysData.keys.shift();
    fs.writeFileSync(keysFilePath, JSON.stringify(keysData, null, 2));
    return key;
}

module.exports = {
    getKeyFromJson,

    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === "bypass_reclamar_key") {
            await interaction.deferReply({ ephemeral: true });

            const key = getKeyFromJson();

            if (!key) {
                return await interaction.editReply({
                    content: "❌ No hay keys disponibles en este momento. Intenta más tarde.",
                });
            }

            try {
                const keyEmbed = new EmbedBuilder()
                    .setTitle("> Tu Bypass Free")
                    .setDescription(
                        `Tu licencia:\n\`\`\`${key}\`\`\`\n\n` +
                        `Ingresa aquí y sigue los pasos:\n` +
                        `https://hyperv.online/free/bypass-free/\n\n` +
                        `¿Te gustó? Contacta con nuestro equipo para adquirir un plan.`
                    )
                    .setColor(config.embedColor)
                    .setThumbnail(config.embedThumbnail)
                    .setImage(config.defaultImage)
                    .setFooter(config.embedFooter)
                    .setTimestamp();

                await interaction.user.send({ embeds: [keyEmbed] });

                return await interaction.editReply({
                    content: "✅ Te enviamos tu key por DM.",
                });
            } catch (dmError) {
                console.error("❌ No se pudo enviar DM:", dmError.message);
                return await interaction.editReply({
                    content: "❌ No pudimos enviarte el DM. Asegúrate de tener los DMs abiertos.",
                });
            }
        }

        if (
            !interaction.customId.startsWith("bypass_aprobar_") &&
            !interaction.customId.startsWith("bypass_rechazar_")
        )
            return;

        try {
            await interaction.deferUpdate();
        } catch (e) {
            console.error("No se pudo hacer deferUpdate:", e.message);
            return;
        }

        try {
            const partes = interaction.customId.split("_");
            const accion = partes[1];
            const solicitudId = parseInt(partes[2]);

            const users = loadBypassUsers();
            const solicitud = users.find((u) => u.solicitudId === solicitudId);

            if (!solicitud) {
                return await interaction.followUp({
                    content: "❌ Solicitud no encontrada.",
                    ephemeral: true,
                });
            }

            if (solicitud.estado !== "pendiente") {
                return await interaction.followUp({
                    content: `⚠️ Esta solicitud ya fue **${solicitud.estado}**.`,
                    ephemeral: true,
                });
            }

            if (accion === "aprobar") {
                const key = getKeyFromJson();

                if (!key) {
                    return await interaction.followUp({
                        content: `❌ No hay keys disponibles en \`bypass_keys.json\`.`,
                        ephemeral: true,
                    });
                }

                solicitud.estado = "aprobada";
                solicitud.licenciaGenerada = true;
                solicitud.licencia = key;
                solicitud.fechaAprobacion = new Date().toISOString();
                solicitud.aprobadoPor = interaction.user.tag;

                const userIndex = users.findIndex((u) => u.solicitudId === solicitudId);
                users[userIndex] = solicitud;
                saveBypassUsers(users);

                try {
                    const user = await interaction.client.users.fetch(solicitud.userId);
                    const licenciaEmbed = new EmbedBuilder()
                        .setTitle("> Tu Bypass Free fue APROBADO")
                        .setDescription(
                            `- Producto: **Bypass Gratis**\n` +
                            `- Duración: **3 días**\n\n` +
                            `- Tu licencia:\n\`\`\`${key}\`\`\`\n\n` +
                            `Ingresa aquí y sigue los pasos:\n` +
                            `https://hyperv.online/free/bypass-free/\n\n` +
                            `¿Te gustó? Contacta con nuestro equipo para adquirir algunos de nuestros planes.`,
                        )
                        .setColor(config.embedColor)
                        .setThumbnail(config.embedThumbnail)
                        .setImage(config.defaultImage)
                        .setFooter(config.embedFooter)
                        .setTimestamp();

                    await user.send({ embeds: [licenciaEmbed] });
                } catch (dmError) {
                    console.error("❌ No se pudo enviar DM:", dmError.message);
                }

                const embedActualizado = EmbedBuilder.from(interaction.message.embeds[0])
                    .setDescription(
                        interaction.message.embeds[0].description +
                        `\n\n✅ **Estado:** APROBADA\n🔑 **Licencia:** \`${key}\``,
                    )
                    .setFooter({
                        text: `Aprobada por ${interaction.user.tag}`,
                        iconURL: config.embedFooter.iconURL,
                    });

                await interaction.editReply({
                    embeds: [embedActualizado],
                    components: [],
                });

                await interaction.followUp({
                    content: `✅ Solicitud #${solicitudId} aprobada. Bypass enviado por DM a <@${solicitud.userId}>.`,
                    ephemeral: true,
                });

            } else if (accion === "rechazar") {
                solicitud.estado = "rechazada";
                solicitud.fechaRechazo = new Date().toISOString();
                solicitud.rechazadoPor = interaction.user.tag;

                const userIndex = users.findIndex((u) => u.solicitudId === solicitudId);
                users[userIndex] = solicitud;
                saveBypassUsers(users);

                try {
                    const user = await interaction.client.users.fetch(solicitud.userId);
                    const rechazoEmbed = new EmbedBuilder()
                        .setTitle("❌ Solicitud Rechazada")
                        .setDescription(
                            "Tu solicitud de Bypass Gratis fue rechazada.\n\n" +
                            "**Motivos comunes:**\n" +
                            "- La captura no muestra el follow correctamente\n" +
                            "- Captura falsa o editada\n\n" +
                            "Puedes volver a intentarlo con `/freebypass`.",
                        )
                        .setColor("#FF0000")
                        .setThumbnail(config.embedThumbnail)
                        .setFooter(config.embedFooter)
                        .setTimestamp();

                    await user.send({ embeds: [rechazoEmbed] });
                } catch (dmError) {
                    console.error("❌ No se pudo enviar DM:", dmError.message);
                }

                const embedActualizado = EmbedBuilder.from(interaction.message.embeds[0])
                    .setDescription(
                        interaction.message.embeds[0].description +
                        `\n\n❌ **Estado:** RECHAZADA`,
                    )
                    .setFooter({
                        text: `Rechazada por ${interaction.user.tag}`,
                        iconURL: config.embedFooter.iconURL,
                    });

                await interaction.editReply({
                    embeds: [embedActualizado],
                    components: [],
                });

                await interaction.followUp({
                    content: `❌ Solicitud #${solicitudId} rechazada.`,
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error("❌ Error en verifyBypassGratis:", error);
            try {
                await interaction.followUp({
                    content: "❌ Ocurrió un error interno. Intenta de nuevo.",
                    ephemeral: true,
                });
            } catch (_) { }
        }
    },
};