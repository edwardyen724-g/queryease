import React from 'react';
import Link from 'next/link';

const features = [
  "Timed caching configurations to optimize performance based on user-defined settings.",
  "Visualization dashboard for monitoring query status, response times, and errors in real-time.",
  "Debugging tools that detail API request/response logs specific to TanStack Query.",
  "Integration wizards to easily embed support into existing projects with minimal setup.",
  "Pre-built templates for common querying patterns based on best practices."
];

const Page: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Transform Your Query Management Experience</h1>
      <p className="text-xl text-center mb-8">
        Streamline your query management for modern frameworks.
      </p>
      <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
        Get Started
      </Link>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside">
          {features.map((feature, index) => (
            <li key={index} className="mb-2">
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Page;