/* eslint-disable camelcase */

import { NextRequest, NextResponse } from 'next/server';

import type { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';
import { headers } from 'next/headers';

export const POST = async (req: NextRequest) => {
  const webhookSecret: string = process.env.WEBHOOK_SECRET || '';
  if (!webhookSecret) throw new Error('Please add a webhook secret');

  const headerPayload = headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature)
    return NextResponse.json('Error no svix headers', { status: 400 });

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-signature': svixSignature,
      'svix-timestamp': svixTimestamp,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook', error);
    return NextResponse.json('Error occured', { status: 400 });
  }

  const eventType = evt.type;
  if (eventType === 'user.created') {
    try {
      const {
        id,
        email_addresses,
        image_url,
        username,
        first_name,
        last_name,
      } = evt.data;
      const mongoUser = await createUser({
        clerkId: id,
        name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
        username: username || `${first_name}_${last_name}`,
        email: email_addresses[0].email_address,
        picture: image_url,
      });
      return NextResponse.json(
        { message: 'OK', user: mongoUser },
        { status: 201 },
      );
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  }
  if (eventType === 'user.updated') {
    try {
      const {
        id,
        email_addresses,
        image_url,
        username,
        first_name,
        last_name,
      } = evt.data;
      const mongoUser = await updateUser({
        clerkId: id,
        updateData: {
          name: `${first_name} ${last_name}`,
          username: username || `${first_name}_${last_name}`,
          email: email_addresses[0].email_address,
          picture: image_url,
        },
        path: `/profile/${id}`,
      });
      return NextResponse.json(
        { message: 'OK', user: mongoUser },
        { status: 201 },
      );
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  }
  if (eventType === 'user.deleted') {
    try {
      const { id } = evt.data;
      const deletedUser = await deleteUser({ clerkId: id as string });

      return NextResponse.json(
        { message: 'OK', user: deletedUser },
        { status: 201 },
      );
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  }
  return NextResponse.json('', { status: 201 });
};
