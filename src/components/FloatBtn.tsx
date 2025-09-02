"use client";

import React from "react";
import {  Plus } from "lucide-react";
import Link from "next/link";

interface FloatingActionButtonProps {
  tooltip?: string;
  href: string;
}

export default function FloatingActionButton({
  href,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-60">
      <div className="group relative">
        <Link
          href={href}
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center 
                     bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                     text-white shadow-lg hover:shadow-xl 
                     transition-all duration-300 ease-out
                     transform hover:scale-110 active:scale-95
                     border-2 border-white/20"
        >
          <div>
            <Plus className="h-5 w-5" />
          </div>
        </Link>

        {/* <div
          className={`absolute bottom-full right-0 mb-3 transition-all duration-200 ${"opacity-0 group-hover:opacity-100 pointer-events-none"}`}
        >
          <div className="relative">
            <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {tooltip}
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
        <div
          className={`absolute inset-0 rounded-full transition-all duration-700 ${"bg-blue-400/0 scale-100 opacity-100"}`}
        /> */}
      </div>
    </div>
  );
}
