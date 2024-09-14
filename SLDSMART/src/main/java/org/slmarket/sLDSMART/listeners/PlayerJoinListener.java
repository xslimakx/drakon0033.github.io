package org.slmarket.sLDSMART.listeners;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.slmarket.sLDSMART.SLDSMART;

public class PlayerJoinListener implements Listener {
    private final SLDSMART plugin;

    public PlayerJoinListener(SLDSMART plugin) {
        this.plugin = plugin;
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        plugin.getMarketplaceManager().checkPendingReturns(event.getPlayer());
    }
}