import { Check } from 'lucide-react';

const STEPS = ['Received', 'In progress', 'Completed'];
const INDEX = { New: 0, 'In progress': 1, Completed: 2 };

export const STATUS_TEXT = {
  New: 'We have received your request and will contact you soon.',
  'In progress': 'Work on your request has started. We will keep in touch with updates.',
  Completed: 'Your project is complete. Thank you for working with Ediamond.',
  Cancelled: 'This request was cancelled. Contact us on WhatsApp if that is a mistake.',
};

export default function Progress({ status, mini = false }) {
  if (status === 'Cancelled') return <p className="cancelled-note">Cancelled</p>;
  const current = INDEX[status] ?? 0;
  return (
    <ol className={`progress ${mini ? 'mini' : ''}`} aria-label={`Progress: ${status}`}>
      {STEPS.map((label, i) => (
        <li key={label} className={i < current || status === 'Completed' ? 'done' : i === current ? 'current' : ''}>
          <span className="dot">{i < current || status === 'Completed' ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
