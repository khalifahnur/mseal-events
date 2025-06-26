"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CreditCard,
  Mail,
  User,
  Printer,
  Download,
  SquarePen,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Membership } from "../../../types/membership";
import { MembershipCard } from "./membershipcard";
import { maskExceptLastFour } from "@/lib/utils";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { toast } from "sonner";
import { WalletCard } from "./Wallet";

interface MembershipPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: Membership
}

export default function MembershipPreviewDialog({
  isOpen,
  onClose,
  member,
}: MembershipPreviewDialogProps) {
  const membershipCardRef = useRef<HTMLDivElement>(null);
  const walletCardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"membership" | "wallet">("membership");

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMembershipTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bronze":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "platinum":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handlePrintOrDownload = async (ref: React.RefObject<HTMLDivElement | null>, action: "print" | "download") => { 
    if (!ref.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(ref.current, {
        backgroundColor: "#ffffff",
      });
      if (action === "download") {
        download(dataUrl, `${member.name}-${activeTab}-card.png`);
      } else {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(
            `<html><body><img src="${dataUrl}" style="width: 100%;"></body></html>`
          );
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      }
    } catch (error) {
      console.error(`${action} failed:`, error);
      toast.error(`Failed to ${action} card. Please try again.`, {
        position: "top-right",
      });
    }
  };


const handleWriteToNFC = async () => {
  console.warn("btn clicked!", member.ecryptWalletId);
  try {
    // Use NDEFReader instead of NDEFWriter
    if (!("NDEFReader" in window)) {
      throw new Error("Web NFC not supported on this device or browser");
    }

    const ndef = new (window as any).NDEFReader();
    const encryptedToken = member.ecryptWalletId;

    if (!encryptedToken) {
      throw new Error("No encrypted token available");
    }

    // Convert to Uint8Array (browser-compatible)
    const binaryString = atob(encryptedToken);
    const tokenBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      tokenBytes[i] = binaryString.charCodeAt(i);
    }

    if (tokenBytes.length > 450) {
      throw new Error("Token too large for NFC tag (~512 bytes capacity)");
    }

    let retries = 3;
    while (retries > 0) {
      try {
        // Write using NDEFReader
        await ndef.write({
          records: [{ recordType: "unknown", data: tokenBytes }]
        });
        alert("✅ Encrypted token written to NFC tag!");
        
        // Make read-only
        await ndef.makeReadOnly();
        alert("🔒 Tag locked successfully!");
        return;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } catch (error: any) {
    console.error("NFC Write failed:", error);
    alert(`❌ Failed to write to NFC tag: ${error.message}\n\nEnsure:\n1. Tag is near device\n2. Tag is unlocked\n3. Tag is NDEF formatted`);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#000] to-[#fae115] text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Membership Preview
            </DialogTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <User className="h-4 w-4" />
              <span className="text-orange-100">{member.name}</span>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "membership" | "wallet")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="wallet">Mseal Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="membership">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Membership Card Preview
                </h3>

                <div ref={membershipCardRef} className="flex justify-center mb-4">
                  <MembershipCard
                    memberName={member.name}
                    qrcode={member.qrcode}
                  />
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => handlePrintOrDownload(membershipCardRef, "print")}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePrintOrDownload(membershipCardRef, "download")}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Full Name</p>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email</p>
                        <p className="font-semibold text-gray-800">{member.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Join Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(member.joinDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Member ID</p>
                        <p className="font-semibold text-gray-800 font-mono">
                          {member.id ? maskExceptLastFour(member.id) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 mt-4">
                <CardContent className="p-4">
                  <h4 className="font-bold text-lg mb-4 text-gray-800">Membership Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-medium mb-2">Membership Type</p>
                      <Badge
                        className={`${getMembershipTypeColor(member.type)} px-3 py-1 text-sm font-semibold uppercase`}
                      >
                        {member.type}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-medium mb-2">Card Status</p>
                      <Badge
                        className={`${getStatusColor(member.cardStatus)} px-3 py-1 text-sm font-semibold uppercase`}
                      >
                        {member.cardStatus}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-medium mb-2">Physical Card</p>
                      <Badge
                        className={`${
                          member.needsPhysicalCard
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        } px-3 py-1 text-sm font-semibold`}
                      >
                        {member.needsPhysicalCard ? "Required" : "Not Required"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Mseal Wallet Card Preview
                </h3>

                <div ref={walletCardRef} className="flex justify-center mb-4">
                  <WalletCard
                    qrcode={member.qrcode}
                    createdAt={member.joinDate || null}
                    expDate={member.expDate || null}
                    membershipTier={member.membershipTier}
                    cardNumber={member.cardNumber}
                  />
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => handlePrintOrDownload(walletCardRef, "print")}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePrintOrDownload(walletCardRef, "download")}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWriteToNFC}
                    className="flex items-center gap-2"
                  >
                    <SquarePen className="h-4 w-4" />
                    Write to NFC
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Full Name</p>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Email</p>
                        <p className="font-semibold text-gray-800">{member.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Wallet Created</p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(member.joinDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}