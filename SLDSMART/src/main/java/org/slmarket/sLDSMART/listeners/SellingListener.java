package org.slmarket.sLDSMART.listeners;

import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.InventoryCloseEvent;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.inventory.ItemStack;
import org.slmarket.sLDSMART.SLDSMART;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class SellingListener implements Listener {
    private final SLDSMART plugin;
    private final Map<UUID, ItemStack> sellingItems = new HashMap<>();

    public SellingListener(SLDSMART plugin) {
        this.plugin = plugin;
    }

    @EventHandler
    public void onInventoryClose(InventoryCloseEvent event) {
        if (event.getView().getTitle().equals(plugin.getLanguageManager().get("sell_item_title"))) {
            ItemStack item = event.getInventory().getItem(0);
            if (item != null && !item.getType().isAir()) {
                sellingItems.put(event.getPlayer().getUniqueId(), item);
                event.getPlayer().sendMessage(ChatColor.GREEN + plugin.getLanguageManager().get("enter_price"));
            } else {
                event.getPlayer().sendMessage(ChatColor.RED + plugin.getLanguageManager().get("no_item_to_sell"));
            }
        }
    }

    @EventHandler
    public void onPlayerChat(AsyncPlayerChatEvent event) {
        Player player = event.getPlayer();
        if (sellingItems.containsKey(player.getUniqueId())) {
            event.setCancelled(true);
            try {
                long price = Long.parseLong(event.getMessage());
                if (price <= 0) {
                    player.sendMessage(ChatColor.RED + plugin.getLanguageManager().get("invalid_price"));
                    return;
                }
                ItemStack item = sellingItems.remove(player.getUniqueId());
                plugin.getMarketplaceManager().addItemToMarket(player, item, price, false);
            } catch (NumberFormatException e) {
                player.sendMessage(ChatColor.RED + plugin.getLanguageManager().get("invalid_price_format"));
            }
        }
    }
}