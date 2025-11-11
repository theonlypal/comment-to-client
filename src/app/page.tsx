'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const springConfig = {
  type: "spring" as const,
  damping: 10,
  mass: 0.75,
  stiffness: 100
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-zinc-950">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent" />

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-zinc-50">
              Turn Instagram Comments Into Customers
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Automatically send DMs, capture leads, and sync to your CRM. No manual work required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
              <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-lg transition-colors">
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-24 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-50 mb-12 text-center">How It Works</h2>

          <div className="space-y-16">
            <motion.div
              className="flex flex-col md:flex-row gap-8 items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-violet-600/10 flex items-center justify-center">
                <span className="text-xl font-bold text-violet-400">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-2">User Comments</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Someone comments on your Instagram post. Our system detects it instantly via Meta webhooks.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col md:flex-row gap-8 items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springConfig, delay: 0.1 }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-violet-600/10 flex items-center justify-center">
                <span className="text-xl font-bold text-violet-400">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-2">Automatic DM</h3>
                <p className="text-zinc-400 leading-relaxed">
                  We send them a personalized DM with your signup link using Meta Graph API v22.0.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col md:flex-row gap-8 items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springConfig, delay: 0.2 }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-violet-600/10 flex items-center justify-center">
                <span className="text-xl font-bold text-violet-400">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-2">Lead Captured</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Their info syncs to PostgreSQL, Google Sheets, and Brevo email list automatically.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-50 mb-12 text-center">Everything You Need</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Instant Automation',
                description: 'Zero manual work. Comments trigger DMs in seconds via Meta webhooks with signature verification.'
              },
              {
                title: 'Multi-Channel Sync',
                description: 'PostgreSQL, Google Sheets, and Brevo integration. All your data in one place.'
              },
              {
                title: 'Smart Forms',
                description: 'Pre-filled data, real-time validation, mobile-optimized. Great user experience.'
              },
              {
                title: 'Admin Dashboard',
                description: 'Search, filter, export leads. Production-ready CRM with CSV export.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springConfig, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-zinc-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative z-10 px-6 py-24 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-50 mb-8 text-center">Built With Modern Technology</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">Next.js 15</span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">TypeScript</span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">PostgreSQL</span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">Meta Graph API v22.0</span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">Google Sheets</span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">Brevo</span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">Prisma</span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">Tailwind CSS</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springConfig}
          >
            <h2 className="text-3xl font-bold text-zinc-50 mb-4">
              Ready to automate your Instagram leads?
            </h2>
            <p className="text-lg text-zinc-400 mb-8">
              Setup takes 5 minutes. No credit card required.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-zinc-500">
          <p>Built for Instagram Business Accounts</p>
        </div>
      </footer>
    </main>
  );
}
