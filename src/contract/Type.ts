import type { AuthContext } from '@webf/auth/context';

import type { DbClient } from '../db/client.js';
import type { Gender } from './DbType.js';

/**
 * The type represents the context object that contains the
 * information user trying to access system and other utility
 * types like database client.
 */
export interface AppContext extends AuthContext {
  db: DbClient;
};

/////////////////////////////////////////////
//////////////// INPUT TYPES ////////////////
/////////////////////////////////////////////
export type AddressInput = {
  house: string;
  street: string;
  landmark: string;
  postalCodeId: string;
};

export type EmailInput = {
  address: string;
  isPrimary: boolean;
};

export type PhoneInput = {
  number: string;
  isPrimary: boolean;
  countryId: string;
};

export type CustomerInput = {
  addresses: AddressInput[];
  emails: EmailInput[];
  phones: PhoneInput[];
};

export interface PersonInput extends CustomerInput {
  givenName: string;
  familyName: string;
  middleName?: string | null;

  dob?: Date | null;
  gender?: Gender | null;
}

export interface OrganizationInput extends CustomerInput {
  name: string;
  people: PersonInput[];
}

//////////////////////////////////////////////
//////////////// OUTPUT TYPES ////////////////
//////////////////////////////////////////////

export type Person = {
  id: string;
  givenName: string;
  familyName: string;
  middleName: string;

  dob: Date | null;
  gender: Gender | null;
};

export type Address = {
  house: string;
  street: string;
  landmark: string;
  postalCodeId: string | null;
  isPrimary: boolean;
};

export type Email = {
  address: string;
  isPrimary: boolean;
};

export type Phone = {
  number: string;
  isPrimary: boolean;
  countryId: string;
};

export type Organization = {
  id: string;
  name: string;
  people: Person[];
  addresses: Address[];
  emails: Email[];
  phones: Phone[];
};

export type ContactOrg = {
  type: 'organization';
  id: string;
  name: string;
};

export type ContactPerson = {
  type: 'person';
  id: string;
  givenName: string;
  familyName: string;
  middleName: string;
};

export type Contact =
  | ContactOrg
  | ContactPerson;
