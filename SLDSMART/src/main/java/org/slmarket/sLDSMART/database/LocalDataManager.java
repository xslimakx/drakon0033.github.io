package org.slmarket.sLDSMART.utils;

import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;
import org.slmarket.sLDSMART.SLDSMART;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

public class LocalDataManager {
    private final SLDSMART plugin;
    private File linksFile;
    private FileConfiguration linksConfig;

    public LocalDataManager(SLDSMART plugin) {
        this.plugin = plugin;
        loadData();
    }

    private void loadData() {
        linksFile = new File(plugin.getDataFolder(), "discord_links.yml");
        if (!linksFile.exists()) {
            plugin.saveResource("discord_links.yml", false);
        }
        linksConfig = YamlConfiguration.loadConfiguration(linksFile);
    }

    public void saveData() {
        try {
            linksConfig.save(linksFile);
        } catch (IOException e) {
            plugin.getLogger().severe("Could not save data to " + linksFile);
        }
    }

    public String getDiscordId(UUID playerId) {
        return linksConfig.getString("links." + playerId.toString());
    }

    public void setDiscordId(UUID playerId, String discordId) {
        linksConfig.set("links." + playerId.toString(), discordId);
        saveData();
    }

    public void removeDiscordId(UUID playerId) {
        linksConfig.set("links." + playerId.toString(), null);
        saveData();
    }
}