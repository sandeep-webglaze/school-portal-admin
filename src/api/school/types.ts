import { ICity } from 'api/city';
import { IFacility } from './facility-api';
import { ISchoolBoard } from './school-boards-api';
import { ISchoolType } from './school-type-api';

export interface ISchool {
  _id: string;
  name: string;
  contactNumber: string;
  mail: string;
  website: string;
  classification: {
    _id: string;
    name: string;
    id: string;
  };
  type: {
    _id: string;
    name: string;
    id: string;
  }[];
  slug: string;
  images: string[]; // Assuming image URLs
  schoolBoards: {
    _id: string;
    name: string;
    id: string;
  }[];
  establishmentYear: number;
  minFees: number;
  maxFees: number;
  avgRating: number;
  status: string;
  id: string;
  published: boolean;
}

export interface CreateSchool {
  name: string;
  chairman: string;
  establishmentYear: number;
  medium: string;
  classification: string;
  type: string[];
  city: string;
  minFees: number;
  maxFees: number;
  admissionStart: string;
  classFrom: string;
  classTo: string;
  admissionEnd: string;
  contactNumber: string;
  mail: string;
  website: string;
  about: string;
  images: string[];
  schoolBoards: string[];
  facilities: string[];
  isFeatured: boolean;
  slug: string;
  categoriesSlugs: string[];
  published: boolean;
}

export interface HomePageSlug {
  _id: string;
  slug: string;
  formattedText: string;
  slugMetaData?: any;
  slugJsonSchema?: string;
  isHomepageSlug: boolean;
  filters: {
    _id: string;
    id: string;
    city: string | ICity;
    classification: string;
    type: string | ISchoolType;
    schoolBoard: string | ISchoolBoard;
    school: string | ISchool;
  };
  __v: number;
  id: string;
}

export interface School {
  _id: string;
  name: string;
  chairman: string;
  medium: string;
  admissionStart: string;
  admissionEnd: string;
  contactNumber: string;
  mail: string;
  website: string;
  about: string;
  classFrom: string;
  classTo: string;
  classification: {
    _id: string;
    name: string;
    id: string;
  };
  type: {
    _id: string;
    name: string;
    id: string;
  }[];
  city: {
    _id: string;
    country: string;
    state: string;
    city: string;
    icon: string;
    id: string;
  };
  slug: HomePageSlug;
  images: string[];
  categoriesSlugs: string[];
  schoolBoards: ISchoolBoard[];
  facilities: IFacility[];
  establishmentYear: number;
  minFees: number;
  maxFees: number;
  avgRating: number;
  avgAcademicsRating: number;
  avgAddmissionRating: number;
  avgExtracurriclarRating: number;
  avgInfrastructureRating: number;
  coordinates: number[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}
