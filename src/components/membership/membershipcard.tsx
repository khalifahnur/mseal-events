"use client";

import { Card } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MembershipCardProps {
  memberName: string;
  //memberNumber: string | null;
  teamName?: string;
  //balance: number;
  logoUrl?: string;
  qrcode: string | null;
}

export function MembershipCard({
  memberName,
  //memberNumber,
  teamName = 'Muranga Seals',
  //balance,
  logoUrl = "https://www.murangaseal.com/assets/logo-a25ccce319b09f73006dc94d71887dbd26f5afeec59c2fa5dca6afaf101fe82c.png",
  qrcode,
}: MembershipCardProps) {
  return (
    <Card className="relative overflow-hidden w-100 h-60 rounded-xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500"></div>
      <div
        className="absolute inset-0 bg-center bg-contain bg-no-repeat filter blur-xs"
        style={{
          backgroundImage: `url("${logoUrl}")`,
        }}
      ></div>

      <div className="relative p-4 flex flex-col justify-between text-white">
        <div className="flex items-center gap-3 flex-row justify-between">
          <div className="w-16 h-16 relative">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={`${teamName} logo`}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-end">
            <h3 className="text-xl font-bold">{teamName}</h3>
            <p className="text-sm font-medium text-white/90">Membership Card</p>
          </div>
        </div>

        <div className="flex flex-row justify-between items-end">
          <div>
            {memberName && (
              <div className="mb-2">
                <div className="text-sm opacity-80">Member Name</div>
                <div className="text-base font-bold">{memberName}</div>
              </div>
            )}

            {/* <div>
              <div className="text-sm opacity-80">Balance</div>
              <div className="font-mono text-base font-bold">
                Ksh.{balance ? balance.toFixed(2) : "N/A"}
              </div>
            </div> */}
          </div>

          {/* <div>
            <div className="text-sm opacity-80">Member Number</div>
            <div className="font-mono text-base font-bold">
              {memberNumber ? maskExceptLastFour(memberNumber) : "N/A"}
            </div>
          </div> */}
          {/* QR Code */}
          <div
            className={cn(
              "bg-white p-2 rounded-sm",
              qrcode ? "w-35 h-35" : "p-4"
            )}
          >
            {qrcode ? (
              <QRCodeSVG
                value={qrcode}
                size={88}
                bgColor="#ffffff"
                fgColor="#000000"
                level="L"
                className="w-full h-full"
              />
            ) : (
              <p className="text-black text-xs">No QR Code</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
