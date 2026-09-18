import { API_HOST } from 'constants/server';
import { generateAuthHeaders, generateURI } from 'helpers';
import { responseHandler } from '../ErrorHandler';
import { Response } from '../types';

export interface ICreateFacility {
  name: string;
  icon: string;
}

export type IFacility = ICreateFacility & { _id: string };

export class FacilityApiProvider {
  baseUrl = API_HOST + '/school-facility';

  async getFacilityList(query: any = {}): Promise<Response<IFacility[]>> {
    const baseUrl = generateURI('/school-facility', query);
    const res = await fetch(baseUrl, {
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }

  async addFacility(body: ICreateFacility): Promise<Response<IFacility>> {
    // const baseUrl = API_HOST + '/school-facility';
    const res = await fetch(this.baseUrl, {
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

  async editFacility(id: string, body: Partial<ICreateFacility>) {
    const endpoint = this.baseUrl + `/${id}`;
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

  async deleteFacility(faciltyId: string): Promise<Response<IFacility>> {
    const res = await fetch(this.baseUrl + `/${faciltyId}`, {
      method: 'DELETE',
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }
}
