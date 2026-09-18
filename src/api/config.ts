import { API_HOST } from 'constants/server';
import { generateAuthHeaders } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface IContactUs {
  phoneNumber: string;
  mail: string;
  address: string;
}

export interface ISocialMedia {
  facebook: string;
  intstagram: string;
  tweeter: string;
  linkedIn: string;
  youtube: string;
  pinterest: string;
}

export interface IConfig {
  contactUs: IContactUs;
  termsAndConditions?: string;
  privacyPolicy?: string;
  refundPolicy?: string;
  aboutUs?: string;
  socialMedia?: ISocialMedia;
  robots?: string;
  defaultSlugMetaData?: object;
  defaultSlugJsonSchema?: string;
}

export async function getConfigDetails(): Promise<Response<IConfig>> {
  const endpoint = `${API_HOST}/app-configuration`;
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return await responseHandler(res);
}

export async function saveConfig(body: Partial<IConfig>): Promise<Response<IConfig>> {
  const endpoint = `${API_HOST}/app-configuration`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      ...generateAuthHeaders()
    },
    body: JSON.stringify(body)
  });
  return await responseHandler(res);
}
