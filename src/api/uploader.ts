import { API_HOST } from 'constants/server';
import { generateAuthHeaders } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

const isFile = (file: any) => file instanceof File;
export async function uploadFile(body: FormData): Promise<Response<string>> {
  const file = body.get('file');
  if (!isFile(file)) return { data: file as string };

  const endpoint = `${API_HOST}/upload`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      ...generateAuthHeaders()
    },
    body: body
  });
  return await responseHandler(res);
}
