import { uploadFile } from 'api/uploader';
import { FILE_TYPE } from 'constants/enums';
import { API_HOST } from 'constants/server';
import { generateAuthHeaders } from 'helpers';
import { responseHandler } from '../ErrorHandler';
import { Response } from '../types';
import { CreateSchool, ISchool, School } from './types';

interface SchoolList {
  schools: ISchool[];
  totalCount: number;
}

export interface ISchoolFilters {
  published?: boolean;
  classification?: string;
  type?: string[];
  schoolBoards?: string[];
  minFees?: number;
  maxFees?: number;
  city?: string;
}

export async function getSchoolList(query: any): Promise<Response<SchoolList>> {
  if (!query.name) delete query.name;
  console.log('filters ==>> ', query);

  const endpoint = API_HOST + `/school/list`;
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...generateAuthHeaders()
    },
    method: 'POST',
    body: JSON.stringify(query)
  });
  return await responseHandler(res);
}

export async function getSchoolDetailById(id: string): Promise<Response<School>> {
  const endpoint = `${API_HOST}/school/${id}`;
  const res = await fetch(endpoint, {
    headers: generateAuthHeaders()
  });
  return await responseHandler(res);
}

const isFile = (item: File | string) => item instanceof File;

const uploadPropertyImages = async (images: any[]) => {
  const finalImages = [];

  for (const image of images) {
    if (isFile(image.file)) {
      const formData = new FormData();
      formData.append('file', image.file);
      formData.append('type', FILE_TYPE.SCHOOL_IMAGES);
      const uploadedUrl = await uploadFile(formData);
      if (uploadedUrl) {
        finalImages.push(uploadedUrl.data);
      }
    } else {
      finalImages.push(image);
    }
  }

  return finalImages;
};

export async function createSchool(body: CreateSchool, schoolId?: string): Promise<Response<ISchool>> {
  console.log('Bef body=>', body);
  const newImages = await uploadPropertyImages(body.images);
  body.images = newImages;
  console.log('AfterBody', body);
  const endpoint = schoolId ? `${API_HOST}/school/${schoolId}` : `${API_HOST}/school`;
  const res = await fetch(endpoint, {
    method: schoolId ? 'PUT' : 'POST',
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

export async function deleteSchool(schoolId: string): Promise<Response<School>> {
  const endpoint = API_HOST + `/school/${schoolId}`;
  const res = await fetch(endpoint, {
    method: 'DELETE',
    headers: generateAuthHeaders()
  });
  return responseHandler(res);
}

interface FeaturedSchoolPriorityReq {
  priorities: {
    schoolId: string;
    priority: number;
  }[];
}

export async function setFeaturedSchoolPriority(body: FeaturedSchoolPriorityReq): Promise<Response<SchoolList>> {
  const endpoint = API_HOST + `/school/featured-school/priority`;
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...generateAuthHeaders()
    },
    method: 'PUT',
    body: JSON.stringify(body)
  });
  return await responseHandler(res);
}
