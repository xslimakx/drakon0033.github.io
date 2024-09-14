package org.slmarket.sLDSMART.commands;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.slmarket.sLDSMART.SLDSMART;

public class LinkDiscordCommand implements CommandExecutor {
    private final SLDSMART plugin;

    public LinkDiscordCommand(SLDSMART plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage(plugin.getLanguageManager().get("general.player_only"));
            return true;
        }

        Player player = (Player) sender;

        if (plugin.getDiscordLinkManager().isLinked(player.getUniqueId())) {
            player.sendMessage(plugin.getLanguageManager().get("discord.link_command.already_linked"));
            return true;
        }

        String code = plugin.getDiscordLinkManager().generateLinkCode(player.getUniqueId());
        player.sendMessage(plugin.getLanguageManager().get("discord.link_command.success").replace("%code%", code));

        // Here you might want to send a message to the Discord bot to DM the player with the link code
        // This depends on how you've set up your Discord bot integration

        return true;
    }
}