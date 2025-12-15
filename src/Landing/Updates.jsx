import React, { useEffect } from "react";

const updates = [
  {
    version: "2.2.1",
    date: "Dec 2024",
    changes: [
      "Fixed invoice PDF alignment issues",
      "Improved mobile responsiveness",
      "Minor performance optimizations",
    ],
  },
  {
    version: "2.2.0",
    date: "Nov 2024",
    changes: [
      "Added refund & privacy policy pages",
      "Improved SEO meta tags",
      "Updated dashboard UI",
    ],
  },
  {
    version: "2.1.0",
    date: "Oct 2024",
    changes: [
      "Introduced GST reports",
      "Download invoices in PDF & Excel",
      "Improved invoice search",
    ],
  },
  {
    version: "2.0.0",
    date: "Sep 2024",
    changes: [
      "Major UI redesign",
      "Improved performance",
      "Better onboarding experience",
    ],
  },
  {
    version: "1.0.0",
    date: "Jul 2024",
    changes: [
      "Initial release",
      "Create & manage invoices",
      "Basic customer management",
    ],
  },
];

export default function Updates() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Product Updates</h1>
      <p className="text-gray-600 mb-8">What’s new in Inside Invoice</p>

      <div className="space-y-8">
        {updates.map((update) => (
          <div
            key={update.version}
            className="border-l-4 border-slate-900 pl-6"
          >
            <h2 className="text-xl font-semibold">
              v{update.version}
              <span className="text-sm text-gray-500 ml-2">
                ({update.date})
              </span>
            </h2>

            <ul className="list-disc ml-5 mt-3 space-y-1 text-gray-700">
              {update.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
