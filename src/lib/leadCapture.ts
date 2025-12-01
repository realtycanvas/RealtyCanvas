/**
 * Lead capture submission helper.
 * Submits lead data to `/api/lead-capture` and returns the JSON response.
 */
export type LeadCapturePayload = {
  name: string;
  phone: string;
  email: string;
  timeline: string;
  propertyType: 'COMMERCIAL' | 'RESIDENTIAL';
  city: string;
  state: string;
  // Optional contextual fields to identify source property
  projectSlug?: string;
  projectTitle?: string;
  sourcePath?: string;
};

export type LeadCaptureResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

/**
 * Submit lead capture payload to backend.
 * Throws an error if the response is not ok.
 */
export async function submitLeadCapture(payload: LeadCapturePayload): Promise<LeadCaptureResponse> {
  // Basic validation to avoid empty submissions
  const required: (keyof LeadCapturePayload)[] = ['name', 'phone', 'email', 'propertyType', 'city', 'state'];
  for (const k of required) {
    if (!payload[k]) {
      throw new Error(`Missing field: ${k}`);
    }
  }

  // Add source path automatically when running in browser
  const enrichedPayload = {
    ...payload,
    sourcePath: payload.sourcePath ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
  };

  const res = await fetch('/api/lead-capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enrichedPayload),
  });

  const data = (await res.json()) as LeadCaptureResponse;
  if (!res.ok) {
    throw new Error(data?.error || data?.message || 'Lead submission failed');
  }
  return data;
}
