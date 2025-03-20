import { NextRequest, NextResponse } from 'next/server';

// We'll use a service like SimilarWeb's API.
// In a real implementation, you'd need to use an actual API key
// For this example, we'll simulate traffic data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
  }

  try {
    // In a real implementation, you would make a call to SimilarWeb or another
    // website traffic API here. For the demo, we'll generate random data.

    // Mock response for demonstration purposes
    const currentDate = new Date();
    const trafficData = {
      domain,
      metrics: [
        {
          month: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1).toISOString().substring(0, 7),
          visits: Math.floor(Math.random() * 100000),
        },
        {
          month: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString().substring(0, 7),
          visits: Math.floor(Math.random() * 100000),
        },
        {
          month: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().substring(0, 7),
          visits: Math.floor(Math.random() * 100000),
        }
      ]
    };

    return NextResponse.json(trafficData);
  } catch (error) {
    console.error('Website traffic check error:', error);
    return NextResponse.json(
      {
        domain,
        status: 'error',
        message: 'Failed to check website traffic'
      },
      { status: 500 }
    );
  }
}
