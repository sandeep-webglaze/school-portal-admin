import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from '../ErrorHandler';
import { Response } from '../types';

export interface ISchoolBoard {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  __v: number;
  id: string;
}
export async function getSchoolBoards(query?: any): Promise<Response<ISchoolBoard[]>> {
  const endpoint = generateURI(`/school-board`, query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function createSchoolBoard(body: { name: string }): Promise<Response<ISchoolBoard>> {
  const endpoint = `${API_HOST}/school-board`;
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

export async function editBoard(id: string, body: { name: string }): Promise<Response<ISchoolBoard>> {
  const endpoint = `${API_HOST}/school-board/${id}`;
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

export async function deleteBoard(id: String): Promise<Response<ISchoolBoard>> {
  const endpoint = `${API_HOST}/school-board/${id}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: generateAuthHeaders()
  });
  return await responseHandler(res);
}
