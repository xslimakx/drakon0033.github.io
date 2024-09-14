package org.slmarket.sLDSMART;

import org.bukkit.plugin.java.JavaPlugin;
import org.slmarket.sLDSMART.commands.AdminCommand;
import org.slmarket.sLDSMART.commands.LinkDiscordCommand;
import org.slmarket.sLDSMART.commands.MarketplaceCommand;
import org.slmarket.sLDSMART.database.MongoDBManager;
import org.slmarket.sLDSMART.discord.DiscordBot;
import org.slmarket.sLDSMART.discord.DiscordLinkManager;
import org.slmarket.sLDSMART.listeners.MarketplaceListener;
import org.slmarket.sLDSMART.marketplace.MarketplaceManager;
import org.slmarket.sLDSMART.utils.LanguageManager;
import org.slmarket.sLDSMART.utils.LocalDataManager;

public class SLDSMART extends JavaPlugin {

    private MongoDBManager mongoDBManager;
    private MarketplaceManager marketplaceManager;
    private DiscordLinkManager discordLinkManager;
    private DiscordBot discordBot;
    private LanguageManager languageManager;
    private LocalDataManager localDataManager;

    @Override
    public void onEnable() {
        saveDefaultConfig();

        languageManager = new LanguageManager(this);
        localDataManager = new LocalDataManager(this);
        mongoDBManager = new MongoDBManager(this);
        marketplaceManager = new MarketplaceManager(this);
        discordLinkManager = new DiscordLinkManager(this);
        discordBot = new DiscordBot(this);

        getCommand("marketplace").setExecutor(new MarketplaceCommand(this));
        getCommand("marketplaceadmin").setExecutor(new AdminCommand(this));
        getCommand("linkdiscord").setExecutor(new LinkDiscordCommand(this));

        getServer().getPluginManager().registerEvents(new MarketplaceListener(this), this);

        marketplaceManager.scheduleExpirationCheck();

        getLogger().info("SLDSMART has been enabled!");
    }

    @Override
    public void onDisable() {
        if (mongoDBManager != null) {
            mongoDBManager.close();
        }
        if (discordBot != null) {
            discordBot.shutdown();
        }
        getLogger().info("SLDSMART has been disabled!");
    }

    public MongoDBManager getMongoDBManager() {
        return mongoDBManager;
    }

    public MarketplaceManager getMarketplaceManager() {
        return marketplaceManager;
    }

    public DiscordLinkManager getDiscordLinkManager() {
        return discordLinkManager;
    }

    public DiscordBot getDiscordBot() {
        return discordBot;
    }

    public LanguageManager getLanguageManager() {
        return languageManager;
    }

    public LocalDataManager getLocalDataManager() {
        return localDataManager;
    }
}