import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface ICta {
  _id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  pageUrl: string;
}
export async function getCtaList(query: any): Promise<Response<ICta[]>> {
  const endpoint = generateURI('/cta-enquiry', query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function deleteCta(enquiryId: string): Promise<Response<ICta>> {
  const endpoint = `${API_HOST}/cta-enquiry/${enquiryId}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}
