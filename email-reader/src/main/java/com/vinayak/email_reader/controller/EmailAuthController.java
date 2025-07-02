package com.vinayak.email_reader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vinayak.email_reader.service.EncryptionService;

@RestController
@RequestMapping("/api/auth")
public class EmailAuthController {

    @Autowired
    private EncryptionService encryptionService;

    @GetMapping("/encrypt-password")
    public ResponseEntity<String> encryptPassword(@RequestParam String plain) throws Exception {
        return ResponseEntity.ok(encryptionService.encrypt(plain));
    }

    @GetMapping("/decrypt-password")
    public ResponseEntity<String> decryptPassword(@RequestParam String encrypted) throws Exception {
        return ResponseEntity.ok(encryptionService.decrypt(encrypted));
    }
}
