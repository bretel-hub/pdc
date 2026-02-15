"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isMerchant = pathname === "/" || pathname.startsWith("/merchant");

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-2 h-9 bg-purple-600 rounded-full"></div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">PDC</span>
              <span className="text-[10px] font-medium tracking-widest text-purple-500 uppercase">Perksdotcom</span>
            </div>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isMerchant ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Merchant
            </Link>
            <Link
              href="/customer"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                !isMerchant ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Customer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
