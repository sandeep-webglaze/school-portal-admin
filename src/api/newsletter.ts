import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface ISubscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export async function getSubscribers(query: any): Promise<Response<ISubscriber[]>> {
  const endpoint = generateURI('/newsletter', query);
  const res = await fetch(endpoint, { headers: generateAuthHeaders() });
  return responseHandler(res);
}

export async function deleteSubscriber(id: string): Promise<Response<ISubscriber>> {
  const endpoint = `${API_HOST}/newsletter/${id}`;
  const res = await fetch(endpoint, { method: 'DELETE', headers: generateAuthHeaders() });
  return responseHandler(res);
}
