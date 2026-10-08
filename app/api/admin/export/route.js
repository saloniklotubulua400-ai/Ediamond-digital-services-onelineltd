import { isAdmin } from '@/lib/auth';
import { listRequests } from '@/lib/store';

const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export async function GET() {
  if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });
  const rows = await listRequests();
  const head = ['Ref', 'Received', 'Status', 'Name', 'Phone', 'Email', 'Service', 'Budget', 'Deadline', 'Message', 'Notes'];
  const lines = rows.map((r) =>
    [r.ref, r.createdAt, r.status, r.name, r.phone, r.email, r.serviceTitle, r.budget, r.deadline, r.message, r.notes].map(cell).join(',')
  );
  return new Response([head.map(cell).join(','), ...lines].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ediamond-requests.csv"',
    },
  });
}
