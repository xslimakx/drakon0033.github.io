package org.slmarket.sLDSMART.discord;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.slmarket.sLDSMART.SLDSMART;

public class DiscordBot extends ListenerAdapter {
    private final SLDSMART plugin;
    private JDA jda;

    public DiscordBot(SLDSMART plugin) {
        this.plugin = plugin;
        try {
            jda = JDABuilder.createDefault(plugin.getConfig().getString("discord.token"))
                    .addEventListeners(this)
                    .build();
            jda.awaitReady();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot()) return;

        String message = event.getMessage().getContentRaw();
        if (message.startsWith("!link")) {
            String[] parts = message.split(" ");
            if (parts.length == 2) {
                String code = parts[1];
                String discordId = event.getAuthor().getId();
                plugin.getDiscordLinkManager().handleLinkCommand(discordId, code);
            } else {
                sendDirectMessage(event.getAuthor().getId(), plugin.getLanguageManager().get("discord-link.invalid-format"));
            }
        }
    }

    public void sendDirectMessage(String discordId, String message) {
        User user = jda.getUserById(discordId);
        if (user != null) {
            user.openPrivateChannel().queue((channel) ->
                    channel.sendMessage(message).queue());
        }
    }

    public void shutdown() {
        if (jda != null) {
            jda.shutdown();
        }
    }
}