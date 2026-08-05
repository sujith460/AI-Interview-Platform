package com.Ai_Interview_Platform.DSA.auth.exception;

/**
 * Thrown when the OTP submitted by the user is incorrect or has expired.
 */
public class OtpVerificationException extends RuntimeException {

    public OtpVerificationException(String message) {
        super(message);
    }
}
