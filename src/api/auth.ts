import { API_HOST } from 'constants/server';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface IOtp {
  otp: string;
  timeout: Date;
  email: string;
  phoneNumber: string;
}

export async function sendOtpIfUserExsist(body: { mail: string }): Promise<Response<IOtp>> {
  const endpoint = `${API_HOST}/auth/forgot-otp`;
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

export async function verifyOtpAndCreateSession(body: { mail: string; otp: string }): Promise<Response<{ token: string }>> {
  const endpoint = `${API_HOST}/auth/forgot-session`;
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

export async function resetPassword(body: { token: string; password: string }): Promise<Response<{ acknowledged: boolean }>> {
  const endpoint = `${API_HOST}/auth/reset-password`;
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
