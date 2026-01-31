import type { ChatInputCommandInteraction } from "discord.js";

import { ContainerBuilder, MessageFlags, SeparatorSpacingSize } from "discord.js";

import makePayment, { parsePaymentData } from "src/commands/bank/_makePayment";
import getCurrencySymbol from "src/utility/getCurrencySymbol";

async function transfer(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return await interaction.reply("This command can only be run in a valid guild.");
  }

  const payee = interaction.options.getUser("payee", true);
  const transferAmount = interaction.options.getNumber("amount", true);

  const { oldPayerCurrent, newPayerCurrent, oldPayeeCurrent, newPayeeCurrent } = parsePaymentData(
    await makePayment(
      { from: interaction.user, to: payee },
      interaction.guild,
      transferAmount,
      interaction,
    ),
  );
  const currencySymbol = await getCurrencySymbol(interaction.guild.id, interaction);

  const container = new ContainerBuilder()
    .addTextDisplayComponents((builder) => {
      return builder.setContent("### Transfer Successful");
    })
    .addSeparatorComponents((builder) => {
      return builder.setSpacing(SeparatorSpacingSize.Large);
    })
    .addTextDisplayComponents((builder) => {
      return builder.setContent(`## ${interaction.user.globalName ?? interaction.user.username}`);
    })
    .addTextDisplayComponents((builder) => {
      return builder.setContent(
        `**Current:** ${currencySymbol}${oldPayerCurrent} → ${currencySymbol}${newPayerCurrent}`,
      );
    })
    .addTextDisplayComponents((builder) => {
      return builder.setContent(`## ${payee.globalName ?? payee.username}`);
    })
    .addTextDisplayComponents((builder) => {
      return builder.setContent(
        `**Current:** ${currencySymbol}${oldPayeeCurrent} → ${currencySymbol}${newPayeeCurrent}`,
      );
    })
    .setAccentColor([0, 255, 0]);

  return await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

export default transfer;
