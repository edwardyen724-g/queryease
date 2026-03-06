import React from 'react';
import Link from 'next/link';

const Page: React.FC = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-4">Transform Your Query Management Experience</h1>
            <p className="text-lg mb-8">
                Streamline your query management for modern frameworks.
            </p>
            <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Get Started
            </Link>

            <section className="mt-10 max-w-4xl">
                <h2 className="text-2xl font-semibold mb-4">MVP Features</h2>
                <ul className="list-disc pl-5">
                    <li>Timed caching configurations to optimize performance based on user-defined settings.</li>
                    <li>Visualization dashboard for monitoring query status, response times, and errors in real-time.</li>
                    <li>Debugging tools that detail API request/response logs specific to TanStack Query.</li>
                    <li>Integration wizards to easily embed support into existing projects with minimal setup.</li>
                    <li>Pre-built templates for common querying patterns based on best practices.</li>
                </ul>
            </section>
        </main>
    );
};

export default Page;