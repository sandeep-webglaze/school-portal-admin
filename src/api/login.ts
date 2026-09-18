import { USER_ROLE } from 'constants/enums';
import { API_HOST } from 'constants/server';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export async function authLogin(body: { mail: string; password: string }): Promise<Response<{ access_token: string; role: USER_ROLE }>> {
  const endpoint = `${API_HOST}/auth/login`;
  const res = await fetch(endpoint, {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return await responseHandler(res);
}
