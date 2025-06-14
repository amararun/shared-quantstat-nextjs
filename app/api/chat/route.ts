import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('🔵 Chat API: Received request');
  
  try {
    const body = await request.json();
    console.log('📥 Chat API: Request payload', body);
    
    if (!process.env.N8N_WEBHOOK_URL) {
      console.error('❌ Chat API: N8N_WEBHOOK_URL is not configured');
      throw new Error('N8N webhook URL is not configured');
    }

    // Forward the request to n8n
    console.log('🔄 Chat API: Forwarding request to n8n');
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 Chat API: n8n response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Chat API: n8n error response:', errorText);
      throw new Error('Failed to get response from agent');
    }

    const data = await response.json();
    console.log('✅ Chat API: n8n response data:', data);
    
    // Return the data directly as received from n8n
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 