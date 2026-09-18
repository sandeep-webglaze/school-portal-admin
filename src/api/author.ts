import { API_HOST } from 'constants/server';
import { generateAuthHeaders } from 'helpers';
import { responseHandler } from './ErrorHandler';
import { Response } from './types';

export type IAuthorStat = {
  value: string;
  label: string;
};

export type IAuthorCard = {
  icon?: string;
  title: string;
  description?: string;
};

export type ICreateAuthor = {
  name: string;
  slug: string;
  designation?: string;
  photo?: string;
  shortBio?: string;
  fullBioHtml?: string;
  quote?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  stats?: IAuthorStat[];
  specialisations?: IAuthorCard[];
  credentials?: IAuthorCard[];
  isActive?: boolean;
};

export type IAuthor = ICreateAuthor & { _id: string };

export type IAuthorFilter = {
  name?: string;
  slug?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

/** A page (slug) where an author is published. */
export type IAuthorPage = {
  _id: string;
  slug: string;
  formattedText?: string;
  heroTitle?: string;
  /** "combination" (search page) or "individual" (school page). */
  slugType?: string;
  /** "assigned" (slug form dropdown) or "content-link" (/author/... link in content). */
  attribution?: string;
};

export type IAuthorPagesResponse = {
  pages: IAuthorPage[];
  totalPages: number;
};

function convertToQueryString(filter: any) {
  const queryString = Object.entries(filter)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value as any)}`)
    .join('&');

  return queryString.length > 0 ? `?${queryString}` : '';
}

export class AuthorApiProvider {
  baseUrl = API_HOST + '/author';

  async getAuthorsList(query: IAuthorFilter = {}): Promise<Response<IAuthor[]>> {
    const res = await fetch(this.baseUrl + convertToQueryString(query), {
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }

  async getAuthorDetailById(authorId: string): Promise<Response<IAuthor>> {
    const res = await fetch(this.baseUrl + `/${authorId}`, {
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }

  /** All pages where this author is published (assigned or content-linked). */
  async getAuthorPages(authorId: string): Promise<Response<IAuthorPagesResponse>> {
    const res = await fetch(this.baseUrl + `/${authorId}/pages`, {
      headers: generateAuthHeaders()
    });
    return responseHandler(res);
  }

  async createAuthor(body: ICreateAuthor): Promise<Response<IAuthor>> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        ...generateAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return await responseHandler(res);
  }

  async updateAuthor(body: Partial<ICreateAuthor>, authorId: string): Promise<Response<{ acknowledged: boolean }>> {
    const res = await fetch(this.baseUrl + `/${authorId}`, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        ...generateAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return await responseHandler(res);
  }

  async deleteAuthor(authorId: string): Promise<Response<IAuthor>> {
    const res = await fetch(this.baseUrl + `/${authorId}`, {
      method: 'DELETE',
      headers: generateAuthHeaders()
    });
    return await responseHandler(res);
  }
}
