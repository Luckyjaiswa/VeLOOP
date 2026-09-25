import api from './api';
import { getLocalAssistantReply } from '../utils/veloopAssistantEngine';

/**
 * Send chat message to backend VELoop Assistant or fallback smoothly to local engine
 * @param {string} message
 * @param {Object} userContext
 * @returns {Promise<{ reply: string, suggested: string[] }>}
 */
export const askAssistant = async (message, userContext = {}) => {
  try {
    const res = await api.post('/api/assistant/chat', { message }, { timeout: 4000 });
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
    throw new Error('Fallback to local engine');
  } catch (err) {
    // Zero latency fallback to local knowledge base engine
    return getLocalAssistantReply(message, userContext);
  }
};
