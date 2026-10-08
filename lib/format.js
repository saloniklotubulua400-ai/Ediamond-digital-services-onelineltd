export const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi' });

export const slug = (s = '') => s.toLowerCase().replace(/\s+/g, '-');
