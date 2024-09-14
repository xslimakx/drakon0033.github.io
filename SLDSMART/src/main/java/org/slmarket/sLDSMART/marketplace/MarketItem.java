package org.slmarket.sLDSMART.marketplace;

import org.bukkit.inventory.ItemStack;

import java.util.UUID;

public class MarketItem {
    private final UUID id;
    private final UUID sellerId;
    private final ItemStack item;
    private final long price;
    private final long expirationTime;

    public MarketItem(UUID id, UUID sellerId, ItemStack item, long price, long expirationTime) {
        this.id = id;
        this.sellerId = sellerId;
        this.item = item;
        this.price = price;
        this.expirationTime = expirationTime;
    }

    public UUID getId() {
        return id;
    }

    public UUID getSellerId() {
        return sellerId;
    }

    public ItemStack getItem() {
        return item;
    }

    public long getPrice() {
        return price;
    }

    public long getExpirationTime() {
        return expirationTime;
    }
}