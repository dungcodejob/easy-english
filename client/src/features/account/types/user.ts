import type { DateOrDateTimeString } from '@/types';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: null;
  district: null;
  registerDate: DateOrDateTimeString;
  langcode: string;
  available: number;
  avatar: null;
  portrait_img: null;

  updatedAt: DateOrDateTimeString;
  updatedBy: string;
  createdBy: DateOrDateTimeString;
  createdAt: string;
}
