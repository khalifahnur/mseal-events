"use client";

import { Card } from "@/components/ui/card";
import formatMonthYear from "@/lib/utils";
import { NfcIcon } from "lucide-react";

interface MembershipCardProps {
  logoUrl?: string;
  qrcode: string | null;
  createdAt: string | null;
  expDate: string | null;
  membershipTier: string | null;
  cardNumber: string | null;
}

export function WalletCard({
  logoUrl = "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1751304986/mseal-logo_dcsiqz.png",
  createdAt,
  expDate,
  membershipTier,
  cardNumber
}: MembershipCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* payment Card */}
      <Card
        className="relative overflow-hidden rounded-2xl shadow-2xl border-0  transition-transform duration-300 hover:-translate-y-2 hover:rotate-[-1deg] hover:scale-105"
        style={{
          transform: "rotate(0deg) translateY(-5px)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tl from-gray-800 via-black to-gray-600 opacity-90"></div>
        <div
          className="absolute inset-0 bg-center bg-contain bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url("${logoUrl}")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>

        <div className="relative p-6 flex flex-col justify-between text-white h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-80">Muranga Seal</p>
              <p className="text-sm font-semibold">
                {membershipTier?.charAt(0).toUpperCase()}
                  {membershipTier?.slice(1)} Member
              </p>
            </div>
            <NfcIcon className="h-8 w-8 opacity-60 transition-transform duration-300 hover:scale-110" />
          </div>

          <div className="flex flex-col items-start space-y-1">
            <p className="text-sm opacity-80">Card Number</p>
            <p className="text-sm font-mono tracking-wider">
              •••• •••• •••• {cardNumber?.slice(-4) ?? "****"}
            </p>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-xs opacity-80">Member Since</p>
              <p className="text-sm">{formatMonthYear(createdAt)}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Expires</p>
              <p className="text-sm">{formatMonthYear(expDate)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
