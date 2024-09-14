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

public class MarketplaceGUI {
    private final SLDSMART plugin;
    private final Player player;
    private Inventory inventory;
    private List<MarketItem> items;
    private int page = 0;

    public MarketplaceGUI(SLDSMART plugin, Player player) {
        this.plugin = plugin;
        this.player = player;
        createInventory();
        loadItems();
    }

    private void createInventory() {
        inventory = Bukkit.createInventory(null, 54, ChatColor.DARK_PURPLE + "Marketplace");
    }

    private void loadItems() {
        items = plugin.getMarketplaceManager().getMarketItems(page * 45, 45);
        updateInventory();
    }

    private void updateInventory() {
        inventory.clear();
        for (int i = 0; i < items.size(); i++) {
            inventory.setItem(i, createItemStack(items.get(i)));
        }
        addNavigationButtons();
    }

    private ItemStack createItemStack(MarketItem marketItem) {
        ItemStack item = marketItem.getItem().clone();
        ItemMeta meta = item.getItemMeta();
        List<String> lore = meta.getLore() != null ? meta.getLore() : new ArrayList<>();
        lore.add(ChatColor.YELLOW + "Price: " + marketItem.getPrice());
        lore.add(ChatColor.GRAY + "Seller: " + Bukkit.getOfflinePlayer(marketItem.getSellerId()).getName());
        meta.setLore(lore);
        item.setItemMeta(meta);
        return item;
    }

    private void addNavigationButtons() {
        if (page > 0) {
            inventory.setItem(45, createNavigationButton(Material.ARROW, "Previous Page"));
        }
        if (items.size() == 45) {
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
        if (slot < 45 && slot < items.size()) {
            MarketItem item = items.get(slot);
            plugin.getMarketplaceManager().buyItem(player, item);
            loadItems(); // Refresh the items after purchase
        } else if (slot == 45 && page > 0) {
            page--;
            loadItems();
        } else if (slot == 53 && items.size() == 45) {
            page++;
            loadItems();
        }
    }
}