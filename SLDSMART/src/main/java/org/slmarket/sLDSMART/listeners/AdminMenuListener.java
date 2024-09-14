package org.slmarket.sLDSMART.listeners;

import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.InventoryClickEvent;
import org.slmarket.sLDSMART.SLDSMART;
import org.slmarket.sLDSMART.gui.AdminMenu;

public class AdminMenuListener implements Listener {
    private final SLDSMART plugin;

    public AdminMenuListener(SLDSMART plugin) {
        this.plugin = plugin;
    }

    @EventHandler
    public void onInventoryClick(InventoryClickEvent event) {
        if (!(event.getWhoClicked() instanceof Player)) return;
        if (!(event.getInventory().getHolder() instanceof AdminMenu)) return;

        event.setCancelled(true);
        Player player = (Player) event.getWhoClicked();
        AdminMenu menu = (AdminMenu) event.getInventory().getHolder();

        menu.handleClick(event.getSlot());
    }
}