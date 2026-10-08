export const SITE = {
  name: 'Ediamond Ltd',
  tagline: 'Your Vision. Our Code.',
  description:
    'Ediamond Ltd is a technology solutions company helping businesses, organizations and individuals bring their ideas to life through innovative, reliable and affordable digital solutions.',
  // Number shown on the poster: 0108770168 (Kenya). International format has no + or leading 0.
  whatsappDisplay: '0108 770 168',
  whatsappIntl: '254108770168',
};

export function waLink(text = '') {
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${SITE.whatsappIntl}${q}`;
}

// Turns a customer's phone number into WhatsApp international format (Kenya default).
export function toIntl(phone = '') {
  const d = String(phone).replace(/\D/g, '');
  if (d.startsWith('254')) return d;
  if (d.startsWith('0')) return '254' + d.slice(1);
  if (d.length === 9) return '254' + d;
  return d;
}
