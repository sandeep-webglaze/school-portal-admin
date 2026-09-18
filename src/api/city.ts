import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface ICity {
  _id: string;
  country: string;
  state: string;
  city: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isPopularCity: boolean;
  slug: string;
}

export interface CreateCity {
  country: string;
  isPopularCity: boolean;
  state: string;
  city: string;
  icon: string;
}

export async function getCitiesList(query: any = {}): Promise<Response<ICity[]>> {
  const endpoint = generateURI('/city', query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function addCity(body: CreateCity): Promise<Response<ICity>> {
  const endpoint = API_HOST + '/city';
  const res = await fetch(endpoint, {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      ...generateAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return responseHandler(res);
}

export async function editCity(id: string, body: Partial<CreateCity>): Promise<Response<ICity>> {
  const endpoint = `${API_HOST}/city/${id}`;
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

export async function deleteCity(cityId: string): Promise<Response<ICity>> {
  const endpoint = API_HOST + `/city/${cityId}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}
