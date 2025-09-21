import Link from "next/link";

const travelLinks = [
  {
    name: "IRCTC",
    url: "https://www.irctc.co.in/",
    description: "Book train tickets",
  },
  {
    name: "EaseMyTrip",
    url: "https://www.easemytrip.com/",
    description: "Flight & hotel bookings",
  },
  {
    name: "Taxi",
    url: "https://www.olacabs.com/",
    description: "Local transportation",
  },
];

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Trip Sage
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {travelLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-50"
                  title={link.description}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="cursor-pointer p-2 rounded-md hover:bg-gray-100 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="py-1">
                  {travelLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title={link.description}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
