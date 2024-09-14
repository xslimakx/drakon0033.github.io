package org.slmarket.sLDSMART.commands;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.slmarket.sLDSMART.SLDSMART;

public class MarketplaceCommand implements CommandExecutor {
    private final SLDSMART plugin;

    public MarketplaceCommand(SLDSMART plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage(plugin.getLanguageManager().get("general.player_only"));
            return true;
        }

        Player player = (Player) sender;

        int page = 1;
        if (args.length > 0) {
            try {
                page = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                player.sendMessage(plugin.getLanguageManager().get("marketplace.invalid_page"));
                return true;
            }
        }

        plugin.getMarketplaceManager().openMarketplaceGUI(player, page);
        return true;
    }
}