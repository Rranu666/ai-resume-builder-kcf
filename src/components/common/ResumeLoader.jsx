import React from 'react';

export default function ResumeLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Resume Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-32 bg-white rounded-lg shadow-xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-emerald-500 opacity-20"></div>
            <div className="p-3 space-y-2">
              <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-1.5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-1.5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-1 bg-green-300 rounded animate-pulse"></div>
              <div className="h-1 bg-green-300 rounded animate-pulse"></div>
              <div className="h-1 bg-green-300 rounded animate-pulse"></div>
            </div>
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-300"></div>
          </div>
          <div className="absolute inset-0 animate-pulse">
            <div className="w-24 h-32 border-2 border-green-400 rounded-lg mx-auto animate-spin-slow"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-800">Loading...</h3>
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-gray-600">Crafting your professional experience...</p>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}