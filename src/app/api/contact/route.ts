import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isValidEmail, isValidName, MAX_NAME_LENGTH, MAX_MESSAGE_LENGTH } from '@/lib/validation';

export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'ic@agents.caladan.build';
const FROM_EMAIL = 'AICOS Website <onboarding@resend.dev>';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, message, name } = body;

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
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate name length
    if (!isValidName(name)) {
      return NextResponse.json(
        { error: `Name must be ${MAX_NAME_LENGTH} characters or less` },
        { status: 400 }
      );
    }

// Validate message length
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New contact from ${name || email}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    console.log('Contact form submission:', {
      email,
      name: name || 'Not provided',
      message: message.substring(0, 100) + '...',
      timestamp: new Date().toISOString(),
      resendId: data.data?.id
    });

    return NextResponse.json(
      { message: 'Message sent successfully', id: data.data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
