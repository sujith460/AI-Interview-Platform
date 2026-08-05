import axiosClient from '@/api/client/axiosClient';
import { ANALYTICS_ENDPOINTS } from '@/api/endpoints/analyticsEndpoints';

export async function fetchUserAnalytics(refresh = false) {
  const { data } = await axiosClient.get(ANALYTICS_ENDPOINTS.GET_ANALYTICS, {
    params: { refresh },
  });
  return data;
}

export async function refreshUserAnalytics() {
  const { data } = await axiosClient.post(ANALYTICS_ENDPOINTS.REFRESH_ANALYTICS);
  return data;
}
