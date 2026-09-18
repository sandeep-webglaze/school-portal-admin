import { GENDER, SCHOOL_ENQUIRY_STATUS } from 'constants/enums';
import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { ICity } from './city';
import { ISchoolType } from './school';
import { Response } from './types';

export interface IEnquiry {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  platform: string;
  class: string;
  city: ICity;
  schoolType: ISchoolType;
  gender: GENDER;
  message: string;
  userIp: string;
  pageUrl: string;
  status: SCHOOL_ENQUIRY_STATUS;
  createdAt: string;
}
export async function getEnquiries(query: any): Promise<Response<IEnquiry[]>> {
  const endpoint = generateURI('/school-enquiry', query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function deleteEnquiry(enquiryId: string): Promise<Response<IEnquiry>> {
  const endpoint = `${API_HOST}/school-enquiry/${enquiryId}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function deleteEnquiries(body: string[]): Promise<Response<IEnquiry[]>> {
  const endpoint = API_HOST + '/school-enquiry';
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: { ...generateAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: body })
  });
  return responseHandler(res);
}

export async function bulkUpdateEnquiries(body: any): Promise<Response<IEnquiry[]>> {
  const endpoint = API_HOST + '/school-enquiry';
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { ...generateAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return responseHandler(res);
}

export interface IRegisterEnq {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  school: string;
  schoolAddress: string;
  createdAt: string;
}

export async function registerSchoolEnquiries(query: any): Promise<Response<IRegisterEnq[]>> {
  const endpoint = generateURI('/claim-school-enquiry', query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function deleteSchoolEnquiry(enquiryId: string): Promise<Response<IRegisterEnq[]>> {
  const endpoint = `${API_HOST}/claim-school-enquiry/${enquiryId}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}
