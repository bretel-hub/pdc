"use client";

export default function LogosPage() {
  return (
    <div className="space-y-12 py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">PDC Logo Concepts</h1>
        <p className="text-gray-500 mt-1">Pick your favorite — I&apos;ll drop it into the navbar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Option A: Diamond gem */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm text-gray-400 mb-6">Option A — Diamond</p>
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 3L33 14L18 33L3 14L18 3Z" fill="#7c3aed" />
              <path d="M18 3L33 14H3L18 3Z" fill="#8b5cf6" />
              <path d="M18 33L3 14H33L18 33Z" fill="#6d28d9" />
            </svg>
            <div>
              <span className="text-2xl font-bold text-gray-900">PDC</span>
              <span className="text-sm text-purple-400 ml-2">perksdotcom</span>
            </div>
          </div>
        </div>

        {/* Option B: Rounded P badge */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm text-gray-400 mb-6">Option B — P Badge</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">PDC</span>
              <span className="text-sm text-purple-400 ml-2">perksdotcom</span>
            </div>
          </div>
        </div>

        {/* Option C: Coin/cashback icon */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm text-gray-400 mb-6">Option C — Cashback Coin</p>
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" fill="#7c3aed" />
              <circle cx="18" cy="18" r="12" stroke="white" strokeWidth="1.5" fill="none" />
              <text x="18" y="23" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="system-ui">$</text>
            </svg>
            <div>
              <span className="text-2xl font-bold text-gray-900">PDC</span>
              <span className="text-sm text-purple-400 ml-2">perksdotcom</span>
            </div>
          </div>
        </div>

        {/* Option D: Abstract arrows / growth */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm text-gray-400 mb-6">Option D — Growth Arrow</p>
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="#7c3aed" />
              <path d="M10 24L16 16L22 20L28 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 10H28V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <span className="text-2xl font-bold text-gray-900">PDC</span>
              <span className="text-sm text-purple-400 ml-2">perksdotcom</span>
            </div>
          </div>
        </div>

        {/* Option E: Stacked modern wordmark */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm text-gray-400 mb-6">Option E — Bold Wordmark</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-9 bg-purple-600 rounded-full"></div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">PDC</span>
              <span className="text-[10px] font-medium tracking-widest text-purple-500 uppercase">Perksdotcom</span>
            </div>
          </div>
        </div>

        {/* Option F: Circle monogram */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm text-gray-400 mb-6">Option F — Circle Monogram</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PDC</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">PDC</span>
              <span className="text-sm text-purple-400 ml-2">perksdotcom</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
