interface SearchParams {
  ig_user_id?: string;
  ig_username?: string;
  campaign?: string;
  comment_id?: string;
  media_id?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  // Next.js 15: searchParams is now async
  const params = await searchParams;

  const igUserId = params.ig_user_id || '';
  const igUsername = params.ig_username || '';
  const campaign = params.campaign || '';
  const commentId = params.comment_id || '';
  const mediaId = params.media_id || '';

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Get Started</h1>

          {igUsername && (
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Hey @{igUsername}! 👋
            </p>
          )}

          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Fill out the form below to continue
          </p>

          <form
            action="/api/intake/submit"
            method="POST"
            className="space-y-6"
          >
            {/* Hidden fields for Instagram context */}
            <input type="hidden" name="igUserId" value={igUserId} />
            <input type="hidden" name="igUsername" value={igUsername} />
            <input type="hidden" name="igCommentId" value={commentId} />
            <input type="hidden" name="igMediaId" value={mediaId} />
            <input type="hidden" name="campaign" value={campaign} />

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="[email protected]"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-2"
              >
                Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium mb-2"
              >
                Additional Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Tell us more about what you're interested in..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
