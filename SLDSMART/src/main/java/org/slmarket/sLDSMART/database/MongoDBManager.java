package org.slmarket.sLDSMART.database;

import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.slmarket.sLDSMART.SLDSMART;

public class MongoDBManager {
    private final SLDSMART plugin;
    private MongoClient mongoClient;
    private MongoDatabase database;
    private MongoCollection<Document> usersCollection;
    private MongoCollection<Document> guildsCollection;

    public MongoDBManager(SLDSMART plugin) {
        this.plugin = plugin;
        connect();
    }

    private void connect() {
        String uri = plugin.getConfig().getString("database.mongodb.uri");
        String dbName = plugin.getConfig().getString("database.mongodb.database");

        if (uri == null || uri.isEmpty() || dbName == null || dbName.isEmpty()) {
            plugin.getLogger().severe("MongoDB connection details are not properly configured.");
            return;
        }

        try {
            mongoClient = MongoClients.create(uri);
            database = mongoClient.getDatabase(dbName);
            usersCollection = database.getCollection("users");
            guildsCollection = database.getCollection("guilds");
            plugin.getLogger().info("Successfully connected to MongoDB.");
        } catch (Exception e) {
            plugin.getLogger().severe("Failed to connect to MongoDB: " + e.getMessage());
        }
    }

    public long getUserBalance(String userId, String guildId) {
        Document user = usersCollection.find(Filters.and(
                Filters.eq("userId", userId),
                Filters.eq("guildId", guildId)
        )).first();

        return user != null ? user.getLong("balance") : 0;
    }

    public void updateUserBalance(String userId, String guildId, long newBalance) {
        usersCollection.updateOne(
                Filters.and(
                        Filters.eq("userId", userId),
                        Filters.eq("guildId", guildId)
                ),
                Updates.set("balance", newBalance)
        );
    }

    public void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}