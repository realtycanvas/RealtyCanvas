import { submitLeadCapture, type LeadCapturePayload } from '@/lib/leadCapture';

describe('submitLeadCapture', () => {
  const payload: LeadCapturePayload = {
    name: 'John Doe',
    phone: '9999999999',
    email: 'john@example.com',
    timeline: '1-month',
    propertyType: 'COMMERCIAL',
    city: 'Gurgaon',
    state: 'Haryana',
  };

  beforeEach(() => {
    (global as any).fetch = jest.fn();
    (global as any).window = undefined;
  });

  it('submits lead and returns success message', async () => {
    (global as any).fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Lead captured successfully!' }),
    });

    const res = await submitLeadCapture(payload);
    expect(res).toEqual({ success: true, message: 'Lead captured successfully!' });
    expect(global.fetch).toHaveBeenCalledWith('/api/lead-capture', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it('throws when response not ok', async () => {
    (global as any).fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Bad request' }),
    });

    await expect(submitLeadCapture(payload)).rejects.toThrow('Bad request');
  });

  it('validates required fields', async () => {
    await expect(submitLeadCapture({ ...payload, name: '' })).rejects.toThrow('Missing field: name');
  });

  it('includes project metadata and auto sourcePath when window is available', async () => {
    (global as any).window = { location: { pathname: '/projects/m3m-altitude' } } as any;
    (global as any).fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await submitLeadCapture({ ...payload, projectSlug: 'm3m-altitude', projectTitle: 'M3M Altitude' });
    const call = (global as any).fetch.mock.calls[0];
    const bodyObj = JSON.parse(call[1].body);
    expect(bodyObj.projectSlug).toBe('m3m-altitude');
    expect(bodyObj.projectTitle).toBe('M3M Altitude');
    expect(bodyObj.sourcePath).toBe('/projects/m3m-altitude');
  });
});
