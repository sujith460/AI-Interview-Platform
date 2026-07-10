import axiosClient from '@/api/client/axiosClient';
import { USER_ENDPOINTS } from '@/api/endpoints/userEndpoints';

export async function getCurrentUser() {
  const { data } = await axiosClient.get(USER_ENDPOINTS.ME);
  return data;
}
