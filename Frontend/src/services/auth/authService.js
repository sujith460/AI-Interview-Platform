import axiosClient from '@/api/client/axiosClient';
import { AUTH_ENDPOINTS } from '@/api/endpoints/authEndpoints';

export async function registerUser(payload) {
  const { data } = await axiosClient.post(AUTH_ENDPOINTS.REGISTER, payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await axiosClient.post(AUTH_ENDPOINTS.LOGIN, payload);
  return data;
}
