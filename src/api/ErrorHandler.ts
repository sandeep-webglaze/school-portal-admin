import { removeUserToken } from 'helpers';
import {
  BadRequestException,
  ErrorSchema,
  FetchDataException,
  InternalServerException,
  NotFoundException,
  UnAuthorizedException
} from './errors/BaseError';
import { Response as CustomResponse } from './types';

async function exceptionHandler<T>(response?: Response): Promise<CustomResponse<T>> {
  if (!response || response === undefined) {
    throw new FetchDataException();
  }

  const jsonResponse = await response.json();

  switch (true) {
    case response.ok:
      return jsonResponse;
    case response?.status === 401:
      handleUnauthorizedException();
      throw new UnAuthorizedException(jsonResponse?.message);
    case response.status === 403:
      throw new UnAuthorizedException(jsonResponse?.message);
    case response.status === 400:
      throw new BadRequestException(jsonResponse?.message.toString());
    case response.status === 404:
      throw new NotFoundException(jsonResponse?.message);
    case response.status === 500:
      throw new InternalServerException(jsonResponse?.message);
    default:
      throw new ErrorSchema(response.status, jsonResponse?.message, 'Something Went Wrong');
  }
}

function handleUnauthorizedException() {
  removeUserToken();
  window.location.href = '/';
  return;
}

export async function responseHandler<T>(response: Response) {
  try {
    return await exceptionHandler<T>(response);
  } catch (error) {
    console.error('An error occurred:', error);
    // eslint-disable-next-line no-throw-literal
    throw error as ErrorSchema<T>;
  }
}
