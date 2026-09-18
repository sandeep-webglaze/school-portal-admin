import { ENQUIRY_PLATFORMS, GENDER } from 'constants/enums';
import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { ICity } from './city';
import { ISchoolType } from './school';
import { Response } from './types';

export interface ILead extends Omit<CreateLead, 'city' | 'schoolType'> {
  _id: string;
  generatedAt: Date;
  owner?: string;
  city?: ICity;
  schoolType?: ISchoolType;
  createdAt: string;
}

export interface CreateLead {
  name: string;
  email: string;
  phoneNumber: string;
  schoolType: string;
  city: string;
  class: string;
  gender: string;
  actualPrice: number;
  currentPrice: number;
}
export interface EnquiryFilters {
  platform?: ENQUIRY_PLATFORMS;
}

export interface LeadFilters extends EnquiryFilters {
  schoolType?: string;
  city?: string;
  gender?: GENDER;
  currentPrice?: number;
  generatedAt?: Date;
  minPrice?: number;
  maxPrice?: number;
}

export async function getMasterLeads(query: any): Promise<Response<ILead[]>> {
  const endpoint = generateURI('/leads', query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function createMasterLead(body: CreateLead): Promise<Response<ILead[]>> {
  const endpoint = API_HOST + '/leads';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { ...generateAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return responseHandler(res);
}

export async function editMasterLead(id: string, body: Partial<CreateLead>): Promise<Response<ILead[]>> {
  const endpoint = API_HOST + `/leads/${id}`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { ...generateAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return responseHandler(res);
}

export async function updateMasterLeads(body: any): Promise<Response<ILead[]>> {
  const endpoint = API_HOST + '/leads';
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { ...generateAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return responseHandler(res);
}
