import axiosClient from '@/api/client/axiosClient';
import { INTERVIEW_ENDPOINTS } from '@/api/endpoints/interviewEndpoints';

/**
 * Fetch conversation details for a given interview session ID.
 */
export async function getConversationBySession(interviewSessionId) {
  const { data } = await axiosClient.get(
    INTERVIEW_ENDPOINTS.GET_CONVERSATION_BY_SESSION(interviewSessionId)
  );
  return data;
}

/**
 * Fetch conversation messages history for a given conversation ID.
 */
export async function getConversationHistory(conversationId) {
  const { data } = await axiosClient.get(
    INTERVIEW_ENDPOINTS.GET_CONVERSATION_MESSAGES(conversationId)
  );
  return data;
}

/**
 * Send a candidate message to the backend conversation module.
 */
export async function sendCandidateMessage(conversationId, content) {
  const { data } = await axiosClient.post(
    INTERVIEW_ENDPOINTS.SEND_CANDIDATE_MESSAGE(conversationId),
    { content }
  );
  return data;
}
