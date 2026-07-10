import axiosClient from '@/api/client/axiosClient';
import { PROFILE_ENDPOINTS } from '@/api/endpoints/profileEndpoints';

export async function getProfile() {
  const { data } = await axiosClient.get(PROFILE_ENDPOINTS.GET);
  return data;
}

export async function updateProfile(payload) {
  const { data } = await axiosClient.put(PROFILE_ENDPOINTS.UPDATE, payload);
  return data;
}
