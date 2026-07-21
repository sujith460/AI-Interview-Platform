import axiosClient from '@/api/client/axiosClient';

export async function getAllQuestions() {
  const { data } = await axiosClient.get('/api/questions');
  return data;
}

export async function getQuestionDetails(slug) {
  const { data } = await axiosClient.get(`/api/questions/slug/${slug}/details`);
  return data;
}

export async function searchQuestions(payload) {
  const { data } = await axiosClient.post('/api/questions/search', payload);
  return data;
}

export async function getAllCompanies() {
  const { data } = await axiosClient.get('/api/companies');
  return data;
}

export async function getAllPatterns() {
  const { data } = await axiosClient.get('/api/patterns');
  return data;
}

export async function runCode(payload) {
  const { data } = await axiosClient.post('/api/run', payload);
  return data;
}

export async function submitCode(payload) {
  const { data } = await axiosClient.post('/api/submit', payload);
  return data;
}
