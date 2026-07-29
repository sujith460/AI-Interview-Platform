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

export async function getSessionDetails(sessionId) {
  const { data } = await axiosClient.get(INTERVIEW_ENDPOINTS.GET_SESSION_DETAILS(sessionId));
  return data;
}

export async function startInterviewSession(sessionId) {
  const { data } = await axiosClient.post(INTERVIEW_ENDPOINTS.START_SESSION(sessionId));
  return data;
}

export async function sendSessionMessage(sessionId, content) {
  const { data } = await axiosClient.post(
    INTERVIEW_ENDPOINTS.SUBMIT_SESSION_MESSAGE(sessionId),
    { content }
  );
  return data;
}

export async function requestSessionHint(sessionId) {
  const { data } = await axiosClient.post(INTERVIEW_ENDPOINTS.REQUEST_SESSION_HINT(sessionId));
  return data;
}

export async function submitSessionCode(sessionId, { code, programmingLanguage, questionId }) {
  const { data } = await axiosClient.post(
    INTERVIEW_ENDPOINTS.SUBMIT_SESSION_CODE(sessionId),
    { code, programmingLanguage, questionId }
  );
  return data;
}

export async function finishInterviewSession(sessionId) {
  const { data } = await axiosClient.post(INTERVIEW_ENDPOINTS.FINISH_SESSION(sessionId));
  return data;
}
