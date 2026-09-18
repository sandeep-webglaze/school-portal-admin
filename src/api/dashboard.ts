import { API_HOST } from 'constants/server';
import { generateAuthHeaders } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface DashboardData {
  totalSchools: number,
  usersCount: {
    admins: number,
    subAdmins: number,
    users: number
  },
  totalCities: number,
  totalCtaEnquiries: number,
}

export async function getDashboardDetails(): Promise<Response<DashboardData>> {
  const endpoint = API_HOST + '/homepage/admin-panel';
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}
