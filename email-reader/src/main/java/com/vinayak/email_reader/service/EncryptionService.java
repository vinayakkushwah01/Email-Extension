package com.vinayak.email_reader.service;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EncryptionService {

    // private final String secretKey = System.getenv("ENCRYPTION_SECRET_KEY");
    // private final String initVector = System.getenv("ENCRYPTION_INIT_VECTOR");

    private final String secretKey;
    private final String initVector;
     public EncryptionService(
        @Value("${encryption.secret-key}") String secretKey,
        @Value("${encryption.init-vector}") String initVector
    ) {
        this.secretKey = secretKey;
        this.initVector = initVector;
    }
    public String encrypt(String value) throws Exception {
        System.out.println("Secret Key: " + secretKey);
        System.out.println("Init Vector: " + initVector);

        IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
        SecretKeySpec skeySpec = new SecretKeySpec(secretKey.getBytes("UTF-8"), "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

        byte[] encrypted = cipher.doFinal(value.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public String decrypt(String encrypted) throws Exception {
        IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
        SecretKeySpec skeySpec = new SecretKeySpec(secretKey.getBytes("UTF-8"), "AES");

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

        byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));
        return new String(original, "UTF-8");
    }
}
