import { CreateSchool } from 'api/school';

const initialValues: CreateSchool = {
  name: '',
  chairman: '',
  establishmentYear: '' as unknown as any,
  medium: '',
  classification: '',
  type: [],
  city: '',
  minFees: '' as unknown as any,
  maxFees: '' as unknown as any,
  admissionStart: '',
  classFrom: '',
  classTo: '',
  admissionEnd: '',
  contactNumber: '',
  mail: '',
  website: '',
  about: '',
  images: [],
  schoolBoards: [],
  facilities: [],
  isFeatured: false,
  slug: '',
  categoriesSlugs: [],
  published: false
};

export { initialValues };
