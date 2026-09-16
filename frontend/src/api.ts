import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface SimplifyResponse {
  original_text: string;
  simplified_text: string;
  summary: string;
}

export interface Risk {
  clause: string;
  risk_level: string;
  explanation: string;
  recommendation: string;
}

export interface RiskAnalysisResponse {
  risks: Risk[];
  overall_assessment: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const simplifyText = async (text: string): Promise<SimplifyResponse> => {
  const response = await axios.post(`${API_URL}/simplify`, { text });
  return response.data;
};

export const analyzeRisks = async (text: string): Promise<RiskAnalysisResponse> => {
  const response = await axios.post(`${API_URL}/highlight`, { text });
  return response.data;
};

export const chatWithDocument = async (document_text: string, messages: ChatMessage[]): Promise<{response: string}> => {
  const response = await axios.post(`${API_URL}/chat`, { document_text, messages });
  return response.data;
};
