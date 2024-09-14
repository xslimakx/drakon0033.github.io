package org.slmarket.sLDSMART.listeners;

import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.InventoryClickEvent;
import org.slmarket.sLDSMART.SLDSMART;
import org.slmarket.sLDSMART.gui.MarketplaceGUI;

public class MarketplaceListener implements Listener {
    private final SLDSMART plugin;

    public MarketplaceListener(SLDSMART plugin) {
        this.plugin = plugin;
    }

    @EventHandler
    public void onInventoryClick(InventoryClickEvent event) {
        if (!(event.getWhoClicked() instanceof Player)) return;
        if (!(event.getInventory().getHolder() instanceof MarketplaceGUI)) return;

        event.setCancelled(true);
        Player player = (Player) event.getWhoClicked();
        MarketplaceGUI gui = (MarketplaceGUI) event.getInventory().getHolder();

        gui.handleClick(event.getSlot());
    }
}