import { User, isMember } from '@webf/auth/context';
import { getUsersByTenant } from '@webf/auth/dal';

import type { AppContext } from '../../contract/Type.js';


export async function getUsers(ctx: AppContext, tenantId: string): Promise<User[]> {
  const { access, db } = ctx;

  if (!isMember(access, tenantId)) {
    throw 'Not authorized';
  }

  const users = await getUsersByTenant(db, tenantId, { number: 1, size: 50 });

  return users;
}
