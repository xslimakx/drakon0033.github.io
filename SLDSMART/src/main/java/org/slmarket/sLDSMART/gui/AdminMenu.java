package org.slmarket.sLDSMART.gui;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Material;
import org.bukkit.entity.Player;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.slmarket.sLDSMART.SLDSMART;
import org.slmarket.sLDSMART.marketplace.MarketItem;

import java.util.ArrayList;
import java.util.List;

public class AdminMenu {
    private final SLDSMART plugin;
    private final Player player;
    private Inventory inventory;
    private List<MarketItem> items;
    private int page = 0;

    public AdminMenu(SLDSMART plugin, Player player) {
        this.plugin = plugin;
        this.player = player;
        createInventory();
        loadItems();
    }

    private void createInventory() {
        inventory = Bukkit.createInventory(null, 54, ChatColor.DARK_RED + "Admin Menu");
    }

    private void loadItems() {
        items = plugin.getMarketplaceManager().getMarketItems();
        updateInventory();
    }

    private void updateInventory() {
        inventory.clear();
        int startIndex = page * 45;
        int endIndex = Math.min(startIndex + 45, items.size());
        for (int i = startIndex; i < endIndex; i++) {
            inventory.setItem(i - startIndex, createItemStack(items.get(i)));
        }
        addNavigationButtons();
    }

    private ItemStack createItemStack(MarketItem marketItem) {
        ItemStack item = marketItem.getItem().clone();
        ItemMeta meta = item.getItemMeta();
        List<String> lore = meta.getLore() != null ? meta.getLore() : new ArrayList<>();
        lore.add(ChatColor.YELLOW + "Price: " + marketItem.getPrice());
        lore.add(ChatColor.GRAY + "Seller: " + Bukkit.getOfflinePlayer(marketItem.getSellerId()).getName());
        lore.add(ChatColor.RED + "Click to remove");
        meta.setLore(lore);
        item.setItemMeta(meta);
        return item;
    }

    private void addNavigationButtons() {
        if (page > 0) {
            inventory.setItem(45, createNavigationButton(Material.ARROW, "Previous Page"));
        }
        if ((page + 1) * 45 < items.size()) {
            inventory.setItem(53, createNavigationButton(Material.ARROW, "Next Page"));
        }
    }

    private ItemStack createNavigationButton(Material material, String name) {
        ItemStack item = new ItemStack(material);
        ItemMeta meta = item.getItemMeta();
        meta.setDisplayName(ChatColor.YELLOW + name);
        item.setItemMeta(meta);
        return item;
    }

    public void open() {
        player.openInventory(inventory);
    }

    public void handleClick(int slot) {
        if (slot < 45 && slot + page * 45 < items.size()) {
            MarketItem item = items.get(slot + page * 45);
            plugin.getMarketplaceManager().removeItemFromMarket(item.getId());
            player.sendMessage(ChatColor.GREEN + "Item removed from marketplace.");
            loadItems(); // Refresh the items after removal
        } else if (slot == 45 && page > 0) {
            page--;
            updateInventory();
        } else if (slot == 53 && (page + 1) * 45 < items.size()) {
            page++;
            updateInventory();
        }
    }
}
