export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum USER_STATUS {
  ACTIVE = 'active',
  BLOCK = 'block'
}

export enum USER_ROLE {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub-admin',
  USER = 'user',
  SCHOOL_ADMIN = 'school-admin'
}
export enum USER_VERIFICATION_STATUS {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export enum FILE_TYPE {
  PROFILE = 'user-images',
  SEO_IMAGES = 'seo-images',
  ICON = 'icons',
  SCHOOL_IMAGES = 'school-images'
}

export enum SORTING_TYPE {
  ASC = 'asc',
  DESC = 'desc'
}

export enum SLUG_TYPE {
  COMBINATION = 'combination',
  INDIVIDUAL = 'individual'
}

export enum SCHOOL_ENQUIRY_STATUS {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

export enum TRANSACTION_TYPE {
  CREDIT = 'credit',
  DEBIT = 'debit',
  PURCHASE = 'purchase_leads'
}

export enum TRANSACTION_STATUS {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending'
}

export enum ENQUIRY_PLATFORMS {
  SOD = 'SOD',
  EDHIPPO = 'EDHIPPO',
  EDHIPPO_APP = 'EDHIPPO_APP'
}

export enum WALLET_PAYMENT_TYPE {
  CREDIT = 'credit',
  DEBIT = 'debit',
}
