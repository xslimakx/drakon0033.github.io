package org.slmarket.sLDSMART.utils;

import org.bukkit.configuration.file.YamlConfiguration;
import org.slmarket.sLDSMART.SLDSMART;

import java.io.File;

public class LanguageManager {
    private final SLDSMART plugin;
    private YamlConfiguration langConfig;

    public LanguageManager(SLDSMART plugin) {
        this.plugin = plugin;
        loadLanguage();
    }

    private void loadLanguage() {
        File langFile = new File(plugin.getDataFolder(), "lang_en.yml");
        if (!langFile.exists()) {
            plugin.saveResource("lang_en.yml", false);
        }
        langConfig = YamlConfiguration.loadConfiguration(langFile);
    }

    public String get(String key) {
        return langConfig.getString(key, "Missing language key: " + key);
    }
}