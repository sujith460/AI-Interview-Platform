import axiosClient from '@/api/client/axiosClient';

export async function getAllQuestions() {
  const { data } = await axiosClient.get('/api/questions');
  return data;
}

export async function getQuestionDetails(slug) {
  const { data } = await axiosClient.get(`/api/questions/slug/${slug}/details`);
  return data;
}
