import { API_HOST } from 'constants/server';
import { generateAuthHeaders } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export type ISlugSchoolFilter = {
  schoolBoard?: string[];
  school?: string;
  slug?: string;
  classification?: string[];
  type?: string[];
  city?: string[];
  isHomepageSlug?: boolean;
  /** COMBINATION (city/board landing pages) or INDIVIDUAL (school detail slugs). */
  slugType?: string;
  page?: number;
  limit?: number;
};

export type ISlugFaq = {
  question: string;
  answer: string;
};

export type ICreateSlug = {
  slug: string;
  slugMetaData?: object;
  slugJsonSchema?: string;
  slugContent?: string;
  formattedText: string;
  isHomepageSlug?: boolean;
  filters?: ISlugSchoolFilter;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  faqs?: ISlugFaq[];
};

export type ISlug = ICreateSlug & { _id: string };

export type IUpdateSlug = Partial<ICreateSlug>;

function convertToQueryString(filter: any) {
  const queryString = Object.entries(filter)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => `${key}=${encodeURIComponent(item)}`).join('&');
      }
      return `${key}=${encodeURIComponent(value as any)}`;
    })
    .join('&');

  return queryString.length > 0 ? `?${queryString}` : '';
}

export class SlugApiProvider {
  baseUrl = API_HOST + '/slug';

  async getSlugsList(query: ISlugSchoolFilter = {}): Promise<Response<ISlug[]>> {
    const baseUrl = this.baseUrl + convertToQueryString(query);
    const res = await fetch(baseUrl, {
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }

  async getSlugDetails(slug: string): Promise<Response<ISlug>> {
    const res = await fetch(this.baseUrl + `/${slug}` + '/slug', {
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }

  async getSlugDetailById(slugId: string): Promise<Response<ISlug>> {
    const res = await fetch(this.baseUrl + `/${slugId}`, {
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }

  async createSlug(body: ICreateSlug): Promise<Response<ISlug>> {
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
    return await responseHandler(res);
  }

  async updateSlug(body: IUpdateSlug, slugId?: string): Promise<Response<{ acknowledged: boolean }>> {
    const res = await fetch(this.baseUrl + `/${slugId}`, {
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
}
