import axiosClient from '@/api/client/axiosClient';
import { AUTH_ENDPOINTS } from '@/api/endpoints/authEndpoints';

/**
 * Step 1 of registration: send OTP to email.
 * Validates that the email is real and delivers a 6-digit code.
 */
export async function sendOtp(email) {
  const { data } = await axiosClient.post(AUTH_ENDPOINTS.SEND_OTP, { email });
  return data;
}

/**
 * Step 2 of registration: verify OTP and create the account.
 * payload must include { fullName, email, password, otp }
 */
export async function registerUser(payload) {
  const { data } = await axiosClient.post(AUTH_ENDPOINTS.REGISTER, payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await axiosClient.post(AUTH_ENDPOINTS.LOGIN, payload);
  return data;
}
