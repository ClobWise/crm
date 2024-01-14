import { after, it } from 'node:test';
import { equal } from 'node:assert';

import { graphql } from '../gql/gql.js';
import { getClientAccess, getDb, getPublicAccess } from '../helper/context.js';
import { run } from '../helper/graphql.js';
import { invitation } from '@webf/base/schema/identity';
import { and, eq } from 'drizzle-orm';

// Get database client
const { db, end } = getDb();

it('Tenant', async (t) => {

  let tenantId = '';

  const email = `test@test.io`;
  const newTenant = {
    name: 'Sensible Inc',
    description: 'First account',
    email,
    firstName: 'Harshal',
    lastName: 'Patil',
  };

  await t.test('createTenant()', async () => {
    const access = getClientAccess();
    const context = { db, access };

    const query = graphql(`
      mutation createTenant($input: NewTenantInput!) {
        createTenant(input: $input) {
          id
          description
        }
      }
    `);

    // SUT - System Under Test
    const result = await run(query, context, {
      input: newTenant
    });

    // Verify - Result
    equal(result.data?.createTenant.description, newTenant.description);

    // Cleanup
    tenantId = result.data?.createTenant.id ?? '';
  });

  await t.test('claimInvitation()', async () => {
    const context = { db, access: getPublicAccess() };
    const invites = await db.select()
      .from(invitation)
      .where(and(
        eq(invitation.email, email),
        eq(invitation.tenantId, tenantId),
      ));

    const { code } = invites[0];

    const query = graphql(`
      mutation claimInvitation($code: String! $password: String!) {
        claimInvitation(inviteCode: $code password: $password)
      }
    `);

    // SUT - System Under Test
    const result = await run(query, context, {
      code,
      password: 'password',
    });

    // Verify - Result
    // TODO:

    // Cleanup
    // TODO:
  });
});


after(end);
