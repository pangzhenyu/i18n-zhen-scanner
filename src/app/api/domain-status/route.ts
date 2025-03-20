import { NextRequest, NextResponse } from 'next/server';

// Function to extract TLD from domain
function extractTLD(domain: string): string {
  const parts = domain.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

// Function to get RDAP URL based on TLD
async function getRdapServiceUrl(tld: string): Promise<string | null> {
  try {
    // IANA RDAP Bootstrap Service
    const response = await fetch('https://data.iana.org/rdap/dns.json');
    const data = await response.json();

    // Find the service URL for the TLD
    for (const serviceKey in data.services) {
      const service = data.services[serviceKey];
      const tlds = service[0];
      const urls = service[1];

      if (tlds.includes(tld)) {
        return urls[0]; // Return the first URL
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching RDAP service URL:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
  }

  try {
    const tld = extractTLD(domain);
    const rdapServiceUrl = await getRdapServiceUrl(tld);

    if (!rdapServiceUrl) {
      return NextResponse.json({
        domain,
        status: 'unknown',
        message: `Could not find RDAP service for TLD: ${tld}`
      });
    }

    // Make RDAP request
    const rdapUrl = `${rdapServiceUrl}/domain/${domain}`;
    const response = await fetch(rdapUrl, {
      headers: {
        'Accept': 'application/rdap+json',
      },
    });

    if (response.status === 404) {
      // Domain not found means it's available
      return NextResponse.json({
        domain,
        status: 'available',
      });
    } else if (response.status === 200) {
      // Domain exists, extract registration date
      const data = await response.json();

      // Try to find registration date in events
      let registrationDate = null;
      if (data.events) {
        for (const event of data.events) {
          if (event.eventAction === 'registration') {
            registrationDate = event.eventDate;
            break;
          }
        }
      }

      return NextResponse.json({
        domain,
        status: 'registered',
        registrationDate,
      });
    } else {
      // Other status codes
      return NextResponse.json({
        domain,
        status: 'unknown',
        message: `Unexpected response from RDAP: ${response.status}`,
      });
    }
  } catch (error) {
    console.error('Domain status check error:', error);
    return NextResponse.json(
      {
        domain,
        status: 'error',
        message: 'Failed to check domain status'
      },
      { status: 500 }
    );
  }
}
