package com.waw.waw.controller;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sms")
@Tag(name = "SMS API", description = "Envoi de SMS via Twilio")
public class SmsController {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-from}")
    private String fromNumber; // ton numéro Twilio

    @Operation(summary = "Envoyer un SMS", description = "Envoie un SMS via Twilio à n'importe quel numéro")
    @PostMapping("/send")
    public String sendSms(
            @Parameter(description = "Numéro destinataire en format international, ex: +21650700441")
            @RequestParam String phone,

            @Parameter(description = "Message à envoyer")
            @RequestParam String message
    ) {
        try {
            Twilio.init(accountSid, authToken);

            Message msg = Message.creator(
                    new PhoneNumber(phone),  // destinataire
                    new PhoneNumber(fromNumber), // numéro Twilio
                    message
            ).create();

            return "SMS envoyé avec succès ! SID: " + msg.getSid();
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur lors de l'envoi : " + e.getMessage();
        }
    }
}
