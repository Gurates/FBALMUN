type ApplicationType = 'delegate' | 'delegation' | 'chairboard' | 'admin' | 'press' | 'song';
// Keep the same ID on a retry, including when the provider saved a row but the
// browser never received its response. No personal data goes into localStorage.
const pendingRequests = new Map<string, string>();

function createRequestId(): string {
  // randomUUID requires HTTPS; getRandomValues also works on local-network HTTP.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const submitApplication = async (type: ApplicationType, data: Record<string, string | number>): Promise<void> => {
  const fingerprint = JSON.stringify({ type, data });
  let requestId = pendingRequests.get(fingerprint);
  if (!requestId) {
    requestId = createRequestId();
    if (pendingRequests.size >= 20) pendingRequests.delete(pendingRequests.keys().next().value!);
    pendingRequests.set(fingerprint, requestId);
  }
  let response: Response;
  try {
    response = await fetch('/api/applications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data, requestId }), signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new Error('We couldn’t confirm your submission. Please try again; your details are still here.');
  }
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success !== true || result?.requestId !== requestId) {
    throw new Error(result?.error || 'Your application could not be saved. Please try again.');
  }
  pendingRequests.delete(fingerprint);
};
