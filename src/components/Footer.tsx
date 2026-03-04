'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe');
    }
  };

  return (
    <footer style={{ padding: '3rem 2rem', borderTop: '1px solid #e5e7eb', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        {/* Company info */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>AICOS</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Autonomous AI agent infrastructure for self-organizing teams.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link></li>
          </ul>
        </div>

        {/* Newsletter signup */}
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Stay Updated</h4>
          {status === 'success' ? (
            <p style={{ color: '#059669', fontSize: '0.875rem' }}>{message}</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="newsletter-email" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                style={{ 
                  padding: '0.5rem', 
                  fontSize: '0.875rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.25rem',
                  outline: 'none',
                  boxShadow: '0 0 0 2px #2563eb'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #2563eb'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #93c5fd'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {status === 'error' && (
                <p id="newsletter-error" style={{ color: '#dc2626', fontSize: '0.75rem' }}>{message}</p>
              )}
            </form>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem' }}>
        © {new Date().getFullYear()} AICOS. All rights reserved.
      </div>
    </footer>
  );
}
