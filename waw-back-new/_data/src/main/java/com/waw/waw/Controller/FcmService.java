package com.waw.waw.controller;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.MulticastMessage;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FcmService {

public String sendToToken(String registrationToken, String title, String body, Map<String,String> data) throws Exception {
    // Log des paramètres reçus
    System.out.println("===== FCM DEBUG =====");
    System.out.println("Token reçu: " + registrationToken);
    System.out.println("Title: " + title);
    System.out.println("Body: " + body);

    if (data == null || data.isEmpty()) {
        System.out.println("Data: vide ou null");
        data = new HashMap<>();
    } else {
        System.out.println("Data: " + data.toString());
    }

    if (registrationToken == null || registrationToken.isBlank()) {
        throw new IllegalArgumentException("Firebase registration token is null or empty");
    }

    // Construction du message
    Message.Builder mb = Message.builder()
            .setToken(registrationToken)
            .setNotification(Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build());

    mb.putAllData(data);

    Message message = mb.build();

    // Log message avant envoi
    System.out.println("Message construit: " + message);

    // Envoi
    String response = FirebaseMessaging.getInstance().send(message);
    System.out.println("Réponse FCM: " + response);
    System.out.println("=====================");

    return response;
}


    // Envoyer à plusieurs tokens (batch)
    public BatchResponse sendToTokens(List<String> tokens, String title, String body, Map<String,String> data) throws Exception {
        if (data == null) {
            data = new HashMap<>();
        }

        MulticastMessage.Builder mb = MulticastMessage.builder()
                .addAllTokens(tokens)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .putAllData(data); // ajoute data

        MulticastMessage message = mb.build();
        return FirebaseMessaging.getInstance().sendMulticast(message);
    }

    // Abonner tokens à un topic
    public void subscribeToTopic(List<String> tokens, String topic) throws Exception {
        FirebaseMessaging.getInstance().subscribeToTopic(tokens, topic);
    }
}
