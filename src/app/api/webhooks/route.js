import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '../../../lib/actions/user';

export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Extract event data and type
  const { id } = evt?.data;
  const eventType = evt?.type;
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle user.created or user.updated events
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { first_name, last_name, image_url, email_addresses, username } =
      evt?.data;
    const primaryEmail = email_addresses?.[0]?.email;

    try {
      await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        primaryEmail,
        username
      );
      return new Response('User is created or updated', {
        status: 200,
      });
    } catch (error) {
      console.log('Error creating or updating user:', error);
      return new Response('Error occurred', {
        status: 400,
      });
    }
  }

  // Handle user.deleted events
  if (eventType === 'user.deleted') {
    try {
      await deleteUser(id);
      return new Response('User is deleted', {
        status: 200,
      });
    } catch (error) {
      console.log('Error deleting user:', error);
      return new Response('Error occurred', {
        status: 400,
      });
    }
  }

  // Default response for unsupported events
  return new Response('', { status: 200 });
}
