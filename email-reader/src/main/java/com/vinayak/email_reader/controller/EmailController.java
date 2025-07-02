package com.vinayak.email_reader.controller;
import com.vinayak.email_reader.model.EmailSummary;
import com.vinayak.email_reader.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/list-unread-today")
    public List<EmailSummary> listUnreadToday(@RequestParam String email, @RequestParam String appPassword) throws Exception {
        return emailService.fetchUnreadToday(email, appPassword);
    }

    @GetMapping("/read")
    public String readEmail(@RequestParam String email, @RequestParam String appPassword, @RequestParam String subject) throws Exception {
        return emailService.readEmailBody(email, appPassword, subject);
    }
}
