package org.slmarket.sLDSMART.discord;

import org.slmarket.sLDSMART.SLDSMART;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Random;

public class DiscordLinkManager {
    private final SLDSMART plugin;
    private final Map<String, UUID> pendingLinks;
    private final Random random;

    public DiscordLinkManager(SLDSMART plugin) {
        this.plugin = plugin;
        this.pendingLinks = new HashMap<>();
        this.random = new Random();
    }

    public boolean isLinked(UUID playerId) {
        return plugin.getLocalDataManager().getDiscordId(playerId) != null;
    }

    public String getDiscordId(UUID playerId) {
        return plugin.getLocalDataManager().getDiscordId(playerId);
    }

    public void linkAccounts(UUID playerId, String discordId) {
        plugin.getLocalDataManager().setDiscordId(playerId, discordId);
    }

    public void unlinkAccounts(UUID playerId) {
        plugin.getLocalDataManager().removeDiscordId(playerId);
    }

    public String generateLinkCode(UUID playerId) {
        String code = generateRandomCode();
        pendingLinks.put(code, playerId);
        return code;
    }

    private String generateRandomCode() {
        StringBuilder code = new StringBuilder();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        return code.toString();
    }

    public void handleLinkCommand(String discordId, String code) {
        UUID playerId = pendingLinks.remove(code);
        if (playerId != null) {
            linkAccounts(playerId, discordId);
            // Notify the player that the link was successful
            plugin.getServer().getPlayer(playerId).sendMessage(plugin.getLanguageManager().get("discord.link_command.link_successful"));
        }
    }
}