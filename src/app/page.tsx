import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Comment to Client</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Automatically convert Instagram comments into qualified leads
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">User Comments on Your Instagram Post</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  When someone comments on your Instagram business account, our system detects it instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Automatic DM with Signup Link</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We automatically send them a personalized DM with a link to your signup page.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lead Captured in CRM</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  When they fill out the form, their information is automatically saved to your database, Google Sheets, and Brevo email list.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/signup"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Try the Signup Form
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Built for Instagram Business Accounts</p>
        </div>
      </div>
    </main>
  );
}
