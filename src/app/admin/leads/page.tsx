'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  createdAt: Date;
  fullName: string;
  email: string;
  phone: string | null;
  igUsername: string | null;
  igUserId: string | null;
  campaign: string | null;
  notes: string | null;
}

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default function AdminLeadsPage({ searchParams }: PageProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'fullName' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const params = await searchParams;
        const token = params.token;

        const response = await fetch(`/api/admin/leads?token=${token}`);
        if (!response.ok) {
          throw new Error('Unauthorized or failed to fetch leads');
        }

        const data = await response.json();
        setLeads(data.leads || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leads');
        setLoading(false);
      }
    };

    fetchLeads();
  }, [searchParams]);

  // Filter leads based on search
  const filteredLeads = leads.filter(lead => {
    const query = searchQuery.toLowerCase();
    return (
      lead.fullName.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.igUsername && lead.igUsername.toLowerCase().includes(query)) ||
      (lead.campaign && lead.campaign.toLowerCase().includes(query))
    );
  });

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aVal: string | Date = '';
    let bVal: string | Date = '';

    if (sortBy === 'createdAt') {
      aVal = new Date(a.createdAt);
      bVal = new Date(b.createdAt);
      return sortOrder === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
    } else {
      aVal = (a[sortBy] || '').toLowerCase();
      bVal = (b[sortBy] || '').toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
  });

  // Paginate
  const totalPages = Math.ceil(sortedLeads.length / perPage);
  const paginatedLeads = sortedLeads.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'IG Username', 'Campaign', 'Notes'];
    const rows = sortedLeads.map(lead => [
      new Date(lead.createdAt).toLocaleDateString(),
      lead.fullName,
      lead.email,
      lead.phone || '',
      lead.igUsername || '',
      lead.campaign || '',
      (lead.notes || '').replace(/"/g, '""'), // Escape quotes
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300">Loading leads...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Unauthorized</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Leads Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Total leads: {leads.length} {filteredLeads.length !== leads.length && `(${filteredLeads.length} filtered)`}
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium mb-2">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Name, email, username, campaign..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Sort By */}
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium mb-2">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="createdAt">Date</option>
                  <option value="fullName">Name</option>
                  <option value="email">Email</option>
                </select>
              </div>

              {/* Per Page */}
              <div>
                <label htmlFor="perPage" className="block text-sm font-medium mb-2">
                  Per Page
                </label>
                <select
                  id="perPage"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>

              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {lead.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                            {lead.phone}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {lead.igUsername ? `@${lead.igUsername}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {lead.campaign || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedLeads.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No leads match your search.' : 'No leads yet. Start by receiving Instagram comments!'}
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {paginatedLeads.map((lead) => (
              <div key={lead.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{lead.fullName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>{' '}
                    <a href={`mailto:${lead.email}`} className="text-blue-600">
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div>
                      <span className="text-gray-500">Phone:</span>{' '}
                      <a href={`tel:${lead.phone}`} className="text-blue-600">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  {lead.igUsername && (
                    <div>
                      <span className="text-gray-500">IG:</span> @{lead.igUsername}
                    </div>
                  )}
                  {lead.campaign && (
                    <div>
                      <span className="text-gray-500">Campaign:</span> {lead.campaign}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {paginatedLeads.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl">
                {searchQuery ? 'No leads match your search.' : 'No leads yet. Start by receiving Instagram comments!'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="text-lg font-medium">{selectedLead.fullName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-lg">
                  <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">
                    {selectedLead.email}
                  </a>
                </p>
              </div>

              {selectedLead.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                  <p className="text-lg">
                    <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">
                      {selectedLead.phone}
                    </a>
                  </p>
                </div>
              )}

              {selectedLead.igUsername && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Instagram Username</label>
                  <p className="text-lg">@{selectedLead.igUsername}</p>
                </div>
              )}

              {selectedLead.campaign && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign</label>
                  <p className="text-lg">{selectedLead.campaign}</p>
                </div>
              )}

              {selectedLead.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</label>
                  <p className="text-lg whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</label>
                <p className="text-lg">
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
