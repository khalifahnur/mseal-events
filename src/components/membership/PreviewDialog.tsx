"use client";
import { useRef } from "react";
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
import { Membership } from "../../../types/membership";
import { MembershipCard } from "./membershipcard";
import { maskExceptLastFour } from "@/lib/utils";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";

export default function MembershipPreviewDialog({
  isOpen,
  onClose,
  member,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: Membership;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string | Date) => {
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

  // const handlePrint = () => {
  //   const printContent = printRef.current;
  //   if (!printContent) return;

  //   const printWindow = window.open("", "_blank");
  //   if (!printWindow) return;

  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.close();
  // };

  const handlePrint = async () => {
    if (!printRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(printRef.current, {
        backgroundColor: "#ffffff",
      });
      download(dataUrl, `${member.name}-membershipcard.png`);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleWriteToNFC = async () => {
    try {
      if ("NDEFWriter" in window) {
        const ndef = new (window as any).NDEFWriter();

        const encryptedToken = member.qrcode;

        await ndef.write({
          records: [
            {
              recordType: "text",
              data: encryptedToken,
            },
          ],
        });

        alert("✅ Encrypted token written to NFC tag!");
      } else {
        alert("❌ Web NFC is not supported on this device or browser.");
      }
    } catch (error) {
      console.error("NFC Write failed:", error);
      alert(
        "❌ Failed to write to NFC tag. Make sure it's close to the device."
      );
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
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Membership Card Preview
            </h3>

            <div ref={printRef} className="flex justify-center mb-4">
              <MembershipCard
                memberName={member.name}
                //memberNumber={member.id}
                //balance={member.balance}
                qrcode={member.qrcode}
              />
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={handlePrint} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Card
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleWriteToNFC}
              >
                <SquarePen className="h-4 w-4" />
                Write
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Full Name
                    </p>
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
                    <p className="font-semibold text-gray-800">
                      {member.email}
                    </p>
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
                    <p className="text-sm text-gray-500 font-medium">
                      Join Date
                    </p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(member.joinDate)}
                    </p>
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
                    <p className="text-sm text-gray-500 font-medium">
                      Member ID
                    </p>
                    <p className="font-semibold text-gray-800 font-mono">
                      {member.id ? maskExceptLastFour(member.id) : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membership Status */}
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-bold text-lg mb-4 text-gray-800">
                Membership Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Membership Type
                  </p>
                  <Badge
                    className={`${getMembershipTypeColor(
                      member.type
                    )} px-3 py-1 text-sm font-semibold uppercase`}
                  >
                    {member.type}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Card Status
                  </p>
                  <Badge
                    className={`${getStatusColor(
                      member.cardStatus
                    )} px-3 py-1 text-sm font-semibold uppercase`}
                  >
                    {member.cardStatus}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    Physical Card
                  </p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
