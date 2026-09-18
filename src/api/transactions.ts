import { TRANSACTION_STATUS, TRANSACTION_TYPE } from 'constants/enums';
import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export interface ITransaction {
  _id: string;
  transactionId: string;
  type: TRANSACTION_TYPE;
  user: string;
  amount: number;
  timestamp: Date;
  orderId?: string;
  paymentMethod: string;
  status: TRANSACTION_STATUS;
  description?: string;
}

export async function getTransactions(query: any): Promise<Response<ITransaction[]>> {
  const endpoint = generateURI('/transactions', query);
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

export async function purchaseLeads(body: { leads: string[] }): Promise<Response<{}>> {
  const endpoint = API_HOST + '/transactions/purchase-leads';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { ...generateAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return responseHandler(res);
}
