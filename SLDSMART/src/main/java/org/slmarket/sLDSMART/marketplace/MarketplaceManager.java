package org.slmarket.sLDSMART.marketplace;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.slmarket.sLDSMART.SLDSMART;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class MarketplaceManager {
    private final SLDSMART plugin;
    private final Map<UUID, MarketItem> marketItems;
    private static final int ITEMS_PER_PAGE = 45;

    public MarketplaceManager(SLDSMART plugin) {
        this.plugin = plugin;
        this.marketItems = new ConcurrentHashMap<>();
    }

    public void addItemToMarket(Player player, ItemStack item, long price, int listingFee) {
        if (item == null || item.getType().isAir()) {
            player.sendMessage(plugin.getLanguageManager().get("marketplace.invalid_item"));
            return;
        }

        if (price <= 0) {
            player.sendMessage(plugin.getLanguageManager().get("marketplace.invalid_price"));
            return;
        }

        try {
            // Apply listing fee
            String discordId = plugin.getDiscordLinkManager().getDiscordId(player.getUniqueId());
            String guildId = plugin.getConfig().getString("discord.guild_id");
            long balance = plugin.getMongoDBManager().getUserBalance(discordId, guildId);
            if (balance < listingFee) {
                player.sendMessage(plugin.getLanguageManager().get("marketplace.not_enough_money_for_fee"));
                return;
            }
            plugin.getMongoDBManager().updateUserBalance(discordId, guildId, balance - listingFee);

            UUID itemId = UUID.randomUUID();
            MarketItem marketItem = new MarketItem(itemId, player.getUniqueId(), createMarketItemStack(item, price, player.getName()), price, System.currentTimeMillis() + 604800000); // 7 days expiration

            marketItems.put(itemId, marketItem);
            player.getInventory().removeItem(item);
            player.sendMessage(plugin.getLanguageManager().get("marketplace.item_added_success"));
        } catch (Exception e) {
            player.sendMessage(plugin.getLanguageManager().get("marketplace.add_item_failed"));
            plugin.getLogger().severe("Failed to add item to market: " + e.getMessage());
        }
    }

    private ItemStack createMarketItemStack(ItemStack originalItem, long price, String sellerName) {
        ItemStack marketItem = originalItem.clone();
        ItemMeta meta = marketItem.getItemMeta();
        List<String> lore = meta.getLore() != null ? meta.getLore() : new ArrayList<>();
        lore.add(plugin.getLanguageManager().get("marketplace.price_prefix") + price);
        lore.add(plugin.getLanguageManager().get("marketplace.seller_prefix") + sellerName);
        meta.setLore(lore);
        marketItem.setItemMeta(meta);
        return marketItem;
    }

    public void removeItemFromMarket(UUID itemId) {
        MarketItem item = marketItems.remove(itemId);
        if (item != null) {
            Player seller = plugin.getServer().getPlayer(item.getSellerId());
            if (seller != null && seller.isOnline()) {
                seller.getInventory().addItem(removeMarketLore(item.getItem()));
                seller.sendMessage(plugin.getLanguageManager().get("marketplace.item_removed_returned"));
            } else {
                storeItemForOfflinePlayer(item.getSellerId(), removeMarketLore(item.getItem()));
            }
        }
    }

    private ItemStack removeMarketLore(ItemStack marketItem) {
        ItemStack originalItem = marketItem.clone();
        ItemMeta meta = originalItem.getItemMeta();
        List<String> lore = meta.getLore();
        if (lore != null && lore.size() >= 2) {
            lore.remove(lore.size() - 1);
            lore.remove(lore.size() - 1);
        }
        meta.setLore(lore);
        originalItem.setItemMeta(meta);
        return originalItem;
    }

    public List<MarketItem> getMarketItems() {
        return new ArrayList<>(marketItems.values());
    }

    public void scheduleExpirationCheck() {
        Bukkit.getScheduler().runTaskTimerAsynchronously(plugin, this::checkExpiredItems, 20L * 60, 20L * 60); // Check every minute
    }

    private void checkExpiredItems() {
        long currentTime = System.currentTimeMillis();
        List<UUID> expiredItems = new ArrayList<>();

        for (MarketItem item : marketItems.values()) {
            if (item.getExpirationTime() <= currentTime) {
                expiredItems.add(item.getId());
            }
        }

        for (UUID itemId : expiredItems) {
            removeItemFromMarket(itemId);
        }

        if (!expiredItems.isEmpty()) {
            plugin.getLogger().info("Removed " + expiredItems.size() + " expired items from the marketplace.");
        }
    }
    public void openMarketplaceGUI(Player player, int page) {
        Inventory gui = Bukkit.createInventory(null, 54, plugin.getLanguageManager().get("marketplace.gui_title") + " - " + page);

        List<MarketItem> items = new ArrayList<>(marketItems.values());
        int startIndex = (page - 1) * ITEMS_PER_PAGE;
        int endIndex = Math.min(startIndex + ITEMS_PER_PAGE, items.size());

        for (int i = startIndex; i < endIndex; i++) {
            MarketItem item = items.get(i);
            gui.addItem(createMarketItemStack(item.getItem(), item.getPrice(), Bukkit.getOfflinePlayer(item.getSellerId()).getName()));
        }

        // Add navigation buttons
        if (page > 1) {
            gui.setItem(45, createNavigationButton(plugin.getLanguageManager().get("marketplace.previous_page"), page - 1));
        }
        if (endIndex < items.size()) {
            gui.setItem(53, createNavigationButton(plugin.getLanguageManager().get("marketplace.next_page"), page + 1));
        }

        player.openInventory(gui);
    }

    private ItemStack createNavigationButton(String name, int page) {
        ItemStack button = new ItemStack(org.bukkit.Material.ARROW);
        ItemMeta meta = button.getItemMeta();
        meta.setDisplayName(name);
        meta.setLore(Collections.singletonList("Page " + page));
        button.setItemMeta(meta);
        return button;
    }
    private void storeItemForOfflinePlayer(UUID playerId, ItemStack item) {
        // This is a placeholder. You might want to implement a more robust system for storing items for offline players.
        // For now, we'll just log it.
        plugin.getLogger().info("Storing item for offline player " + playerId + ": " + item.getType());
    }

    public boolean buyItem(Player buyer, UUID itemId) {
        MarketItem item = marketItems.get(itemId);
        if (item == null) {
            buyer.sendMessage(plugin.getLanguageManager().get("marketplace.item_not_available"));
            return false;
        }

        String buyerDiscordId = plugin.getDiscordLinkManager().getDiscordId(buyer.getUniqueId());
        String sellerDiscordId = plugin.getDiscordLinkManager().getDiscordId(item.getSellerId());
        String guildId = plugin.getConfig().getString("discord.guild_id");

        long buyerBalance = plugin.getMongoDBManager().getUserBalance(buyerDiscordId, guildId);
        if (buyerBalance < item.getPrice()) {
            buyer.sendMessage(plugin.getLanguageManager().get("marketplace.not_enough_money"));
            return false;
        }

        try {
            // Update balances
            plugin.getMongoDBManager().updateUserBalance(buyerDiscordId, guildId, buyerBalance - item.getPrice());
            plugin.getMongoDBManager().updateUserBalance(sellerDiscordId, guildId, plugin.getMongoDBManager().getUserBalance(sellerDiscordId, guildId) + item.getPrice());

            // Give item to buyer
            buyer.getInventory().addItem(removeMarketLore(item.getItem()));
            buyer.sendMessage(plugin.getLanguageManager().get("marketplace.purchase_successful").replace("%price%", String.valueOf(item.getPrice())));

            // Notify seller if online
            Player seller = plugin.getServer().getPlayer(item.getSellerId());
            if (seller != null && seller.isOnline()) {
                seller.sendMessage(plugin.getLanguageManager().get("marketplace.item_sold").replace("%price%", String.valueOf(item.getPrice())));
            }

            // Remove item from market
            marketItems.remove(itemId);

            return true;
        } catch (Exception e) {
            buyer.sendMessage(plugin.getLanguageManager().get("marketplace.purchase_failed"));
            plugin.getLogger().severe("Failed to process purchase: " + e.getMessage());
            return false;
        }
    }
}