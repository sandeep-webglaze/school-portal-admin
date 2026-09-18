import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from '../ErrorHandler';
import { Response } from '../types';

export interface ISchoolType {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
export async function getSchoolTypes(query?: any): Promise<Response<ISchoolType[]>> {
  const endpoint = generateURI(`/school-type`, query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function createSchoolType(body: { name: string }): Promise<Response<ISchoolType>> {
  const endpoint = `${API_HOST}/school-type`;
  const res = await fetch(endpoint, {
    method: 'POST',
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

export async function editSchoolType(id: string, body: { name: string }): Promise<Response<ISchoolType>> {
  const endpoint = `${API_HOST}/school-type/${id}`;
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

export async function deleteSchoolType(id: String): Promise<Response<ISchoolType>> {
  const endpoint = `${API_HOST}/school-type/${id}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: generateAuthHeaders()
  });
  return await responseHandler(res);
}
