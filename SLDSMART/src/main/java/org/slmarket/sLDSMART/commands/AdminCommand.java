package org.slmarket.sLDSMART.commands;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.slmarket.sLDSMART.SLDSMART;
import org.slmarket.sLDSMART.marketplace.MarketItem;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AdminCommand implements CommandExecutor {
    private final SLDSMART plugin;

    public AdminCommand(SLDSMART plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage(plugin.getLanguageManager().get("general.player_only"));
            return true;
        }

        Player player = (Player) sender;

        if (!player.hasPermission("sldsmart.admin")) {
            player.sendMessage(plugin.getLanguageManager().get("admin.no_permission"));
            return true;
        }

        if (args.length < 1) {
            player.sendMessage(plugin.getLanguageManager().get("general.invalid_usage"));
            return true;
        }

        switch (args[0].toLowerCase()) {
            case "add":
                if (args.length < 2) {
                    player.sendMessage(plugin.getLanguageManager().get("general.invalid_usage"));
                    return true;
                }
                addItemToMarket(player, args[1]);
                break;
            case "remove":
                openRemoveGUI(player);
                break;
            default:
                player.sendMessage(plugin.getLanguageManager().get("admin.invalid_subcommand"));
        }

        return true;
    }

    private void addItemToMarket(Player player, String priceStr) {
        ItemStack itemInHand = player.getInventory().getItemInMainHand();
        if (itemInHand.getType().isAir()) {
            player.sendMessage(plugin.getLanguageManager().get("marketplace.invalid_item"));
            return;
        }

        long price;
        try {
            price = Long.parseLong(priceStr);
        } catch (NumberFormatException e) {
            player.sendMessage(plugin.getLanguageManager().get("marketplace.invalid_price"));
            return;
        }

        long minPrice = plugin.getConfig().getLong("marketplace.min_price");
        long maxPrice = plugin.getConfig().getLong("marketplace.max_price");
        if (price < minPrice || price > maxPrice) {
            player.sendMessage(plugin.getLanguageManager().get("marketplace.price_out_of_range")
                    .replace("%min%", String.valueOf(minPrice))
                    .replace("%max%", String.valueOf(maxPrice)));
            return;
        }

        int adminListingFee = plugin.getConfig().getInt("marketplace.admin_listing_fee");
        if (adminListingFee < 0) {
            player.sendMessage(plugin.getLanguageManager().get("admin.invalid_listing_fee"));
            return;
        }

        plugin.getMarketplaceManager().addItemToMarket(player, itemInHand, price, adminListingFee);
        player.sendMessage(plugin.getLanguageManager().get("admin.item_added"));
    }

    private void openRemoveGUI(Player player) {
        Inventory inv = Bukkit.createInventory(null, 54, plugin.getLanguageManager().get("admin.remove_gui_title"));
        List<MarketItem> items = plugin.getMarketplaceManager().getMarketItems();

        for (int i = 0; i < Math.min(items.size(), 54); i++) {
            MarketItem item = items.get(i);
            ItemStack displayItem = item.getItem().clone();
            ItemMeta meta = displayItem.getItemMeta();
            List<String> lore = meta.getLore() != null ? meta.getLore() : new ArrayList<>();
            lore.add(plugin.getLanguageManager().get("marketplace.price_prefix") + item.getPrice());
            lore.add(plugin.getLanguageManager().get("marketplace.seller_prefix") + Bukkit.getOfflinePlayer(item.getSellerId()).getName());
            lore.add(plugin.getLanguageManager().get("admin.click_to_remove"));
            meta.setLore(lore);
            displayItem.setItemMeta(meta);
            inv.setItem(i, displayItem);
        }

        player.openInventory(inv);
    }

    public void handleRemoveClick(Player player, int slot) {
        List<MarketItem> items = plugin.getMarketplaceManager().getMarketItems();
        if (slot >= 0 && slot < items.size()) {
            MarketItem item = items.get(slot);
            plugin.getMarketplaceManager().removeItemFromMarket(item.getId());
            player.sendMessage(plugin.getLanguageManager().get("admin.item_removed"));
            openRemoveGUI(player); // Refresh the GUI
        }
    }
}