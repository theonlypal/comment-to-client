import { prisma } from '@/lib/db';

interface SearchParams {
  token?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  // Next.js 15: searchParams is now async
  const params = await searchParams;
  const token = params.token;

  const adminToken = process.env.ADMIN_ACCESS_TOKEN;

  // Check authorization
  if (!token || token !== adminToken) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Unauthorized</h1>
          <p className="text-gray-600 dark:text-gray-300">
            You do not have permission to access this page.
          </p>
        </div>
      </main>
    );
  }

  // Fetch leads from database
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  type Lead = typeof leads[0];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leads Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Total leads: {leads.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IG Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leads.map((lead: Lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {lead.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.igUsername ? `@${lead.igUsername}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.campaign || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {lead.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leads.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No leads yet. Start by receiving Instagram comments!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
