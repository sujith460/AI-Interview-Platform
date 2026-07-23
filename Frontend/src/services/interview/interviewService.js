import axiosClient from '@/api/client/axiosClient';
import { INTERVIEW_ENDPOINTS } from '@/api/endpoints/interviewEndpoints';

export async function createInterviewSession(payload) {
  const { data } = await axiosClient.post(INTERVIEW_ENDPOINTS.CREATE_SESSION, payload);
  return data;
}

export async function getCompanies() {
  const { data } = await axiosClient.get(INTERVIEW_ENDPOINTS.GET_COMPANIES);
  return data;
}
