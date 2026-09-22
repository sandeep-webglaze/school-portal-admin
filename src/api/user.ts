import { USER_ROLE, USER_STATUS, USER_VERIFICATION_STATUS, WALLET_PAYMENT_TYPE } from 'constants/enums';
import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface UpdateUserDto extends Partial<CreateUser> {
  _id?: string;
  status?: USER_STATUS;
}

export interface CreateUser {
  name: string;
  mail: string;
  phoneNumber: string;
  password: string;
  role: USER_ROLE;
}

export interface IUser extends CreateUser {
  _id: string;
  status: USER_STATUS;
  verificationStatus: USER_VERIFICATION_STATUS;
  imageUrl: string;
  school?: { slug: string };
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSelfDetails(): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/user/profile`;
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  const data = await res.json();
  return data as Response<IUser>;
}

export async function getUsersList(query: { role?: string; page?: number; limit?: number } = {}): Promise<Response<IUser[]>> {
  const endpoint = generateURI('/user', query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export interface UserProfileData {
  requestsCount: number;
  listingCount: number;
  transactionCount: number;
  requestedProperties: any;
}

export async function getUserProfileDetails(userId: string): Promise<Response<UserProfileData>> {
  const endpoint = `${API_HOST}/homepage/user-profile-data?userId=${userId}`;
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function createNewUser(body: CreateUser): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/user`;
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
  return await responseHandler(res);
}

export interface RegisterSchoolUserDto {
  name: string;
  mail: string;
  phoneNumber: string;
  password: string;
  school: string;
}

// Creates a School Admin login linked to a specific school (POST /user/school-user).
export async function createSchoolUser(body: RegisterSchoolUserDto): Promise<Response<{ acknowledged: boolean }>> {
  const endpoint = API_HOST + '/user/school-user';
  const res = await fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...generateAuthHeaders()
    },
    body: JSON.stringify(body)
  });
  return await responseHandler(res);
}

export async function updateUser(body: UpdateUserDto, userId?: string): Promise<Response<{ acknowledged: boolean }>> {
  const endpoint = userId ? `${API_HOST}/user/profile/${userId}` : `${API_HOST}/user/profile`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      ...generateAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return await responseHandler(res);
}

export async function deleteUser(userId: string): Promise<Response<{ acknowledged: boolean }>> {
  const endpoint = `${API_HOST}/user/${userId}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      ...generateAuthHeaders()
    }
  });
  return await responseHandler(res);
}

export async function toggleVerification(body: {
  userIds: string[];
  verificationStatus: USER_VERIFICATION_STATUS;
}): Promise<Response<{ acknowledged: boolean }>> {
  const endpoint = `${API_HOST}/user/toggle-verification`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      ...generateAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return await responseHandler(res);
}

interface IDeleteAccountRequest {
  _id: string;
  userid: string;
  name: string;
  email: string;
  reason: string;
  createdAt: string;
}

export async function getDeleteRequests(query: any): Promise<Response<IDeleteAccountRequest[]>> {
  const endpoint = generateURI(`/delete-account-requests`, query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

/**
 * ############################################################
 * ############################################################
 * ############################################################
 *                       Wallet Api's
 * ############################################################
 * ############################################################
 * ############################################################
 */

export interface IWallet {
  _id: string;
  amount: string;
  user: IUser;
  lastPaymentAt: Date;
}

export interface ICreateWallet {
  amount: string;
  user: string;
}

export interface IUpdateWallet {
  amount: number;
  user: string;
  type: WALLET_PAYMENT_TYPE;
}

export async function getUserWallets(query: any): Promise<Response<IWallet[]>> {
  const endpoint = generateURI(`/wallets`, query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function updateUserWallet(data: IUpdateWallet) {
  const res = await fetch(`${API_HOST}/wallets/${data.user}`, {
    method: 'PUT',
    headers: { ...generateAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: data.amount,
      type: data.type,
    })
  });
  return responseHandler(res);
}
