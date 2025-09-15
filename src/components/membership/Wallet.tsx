"use client";

import { Card } from "@/components/ui/card";
import formatMonthYear from "@/lib/utils";
import { NfcIcon } from "lucide-react";

interface MembershipCardProps {
  logoUrl?: string;
  qrcode: string | null;
  createdAt: string | null;
  membershipTier: string | null;
  cardNumber: string | null;
}

export function WalletCard({
  logoUrl = "https://mseal-membership.vercel.app/_next/image?url=%2Fassets%2Fmseal-logo.png&w=128&q=75",
  createdAt,
  membershipTier,
  cardNumber,
}: MembershipCardProps) {
  const tierStyles = {
    gold: {
      chip: "bg-gradient-to-br from-[#fae115] to-yellow-600 border-[#fae115]/50",
      text: "text-[#fae115]",
    },
    silver: {
      chip: "bg-gradient-to-br from-gray-300 to-gray-500 border-gray-300/50",
      text: "text-gray-300",
    },
    bronze: {
      chip: "bg-gradient-to-br from-amber-800 to-amber-600 border-amber-800/50",
      text: "text-amber-800",
    },
    default: {
      chip: "bg-gradient-to-br from-gray-500 to-gray-700 border-gray-500/50",
      text: "text-gray-500",
    },
  };

  const normalizedTier = membershipTier?.toLowerCase();
  const { chip: chipClass, text: textClass } =
    normalizedTier === "gold" ||
    normalizedTier === "silver" ||
    normalizedTier === "bronze"
      ? tierStyles[normalizedTier]
      : tierStyles.default;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Card className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-[#fae115]/30 bg-gray-900 text-white transition-transform duration-300 hover:-translate-y-2 hover:rotate-[-1deg] hover:scale-105 hover:shadow-[0_8px_24px_rgba(250,225,21,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-black to-gray-600 opacity-95"></div>
        <div
          className="absolute inset-0 bg-center bg-contain bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url("${logoUrl}")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-[#fae115]/10"></div>

        {/* Card Content */}
        <div className="relative p-6 flex flex-col justify-between h-full min-h-[200px]">
          {/* Header: Logo and NFC */}
          <div className="flex justify-between items-start mb-4">
            <div className="text-left">
              <p className={`text-sm font-semibold tracking-wide ${textClass}`}>
                Muranga Seal
              </p>
              <p className={`text-lg font-medium capitalize ${textClass}`}>
                {membershipTier ? `${membershipTier} Member` : "Member"}
              </p>
            </div>
            <NfcIcon className={`h-8 w-8 ${textClass}/90 transition-transform duration-300 hover:scale-110`} />
          </div>

          {/* Card Chip */}
          <div className="mb-4">
            <div className={`w-12 h-8 rounded-md shadow-inner border ${chipClass}`}></div>
          </div>

          {/* Member Since */}
          <div className="flex justify-between items-end mt-4">
            <div className="text-left">
              <p className="text-xs opacity-80">Card Number</p>
              <p className="text-sm font-medium tracking-widest text-white/90 drop-shadow-md">
                •••• •••• •••• {cardNumber?.slice(-4) ?? "****"}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs opacity-80">Member Since</p>
              <p className="text-sm font-medium">
                {createdAt ? formatMonthYear(createdAt) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}