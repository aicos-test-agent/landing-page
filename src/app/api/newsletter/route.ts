import { NextResponse } from 'next/server';
import { isValidEmail, MAX_EMAIL_LENGTH } from '@/lib/validation';

export const runtime = 'edge';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://goeycumarpmatdsjzoro.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_N_3mONQpL5a3rGYkeqAHig_Kljb8XkK';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Check payload size
    const bodyStr = JSON.stringify(body);
    if (bodyStr.length > 10 * 1024) { // 10KB max
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: `Valid email is required (max ${MAX_EMAIL_LENGTH} characters)` },
        { status: 400 }
      );
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_signups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email })
    });

    if (response.status === 409) {
      // Duplicate email - already subscribed
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 200 }
      );
    }

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Failed to subscribe', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully subscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
