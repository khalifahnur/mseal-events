"use client";

import type React from "react";
import { useState } from "react";
import { ArrowLeft, Mail, Shield, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSignin, useVerifyCode } from "@/hooks/Authhook/authHook";
import { useRouter } from "next/navigation";

type Step = "email" | "code" | "success";

interface SignInFormProps {
  //onSuccess?: () => void;
  onSignUpClick: () => void;
}

export default function SignIn({ onSignUpClick }: SignInFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars*/
  const [error, setError] = useState("");

  const sendEmailMutation = useAdminSignin();
  const sendVerifyCode = useVerifyCode();
  const router = useRouter();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }

    setCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const inputToFocus = document.getElementById(`code-${focusIndex}`);
    inputToFocus?.focus();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendEmailMutation.mutateAsync({ email });
      setIsLoading(false);
      setCurrentStep("code");
    } catch (error: any) {
      /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
      const errorMessage =
        error?.message ||
        (error.statusCode === 401
          ? "Invalid email"
          : "Please verify your email.");
      setError(errorMessage);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codeString = code.join("");
    if (codeString.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      await sendVerifyCode.mutateAsync({ email, code: codeString });
      setIsLoading(false);
      setCurrentStep("success");

      setTimeout(()=>{
        router.replace("/events")
      },3000)

    } catch (error: any) {
      /*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
      const errorMessage =
        error?.message ||
        (error.statusCode === 401
          ? "Invalid reset code"
          : "Please verify your code.");
      setError(errorMessage);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep === "code") setCurrentStep("email");
  };

  const getStepIcon = (step: Step) => {
    switch (step) {
      case "email":
        return <Mail className="h-6 w-6" />;
      case "code":
        return <Shield className="h-6 w-6" />;
      case "success":
        return <Check className="h-6 w-6" />;
    }
  };

  const getStepTitle = (step: Step) => {
    switch (step) {
      case "email":
        return "Enter Email";
      case "code":
        return "Enter Verification Code";
      case "success":
        return "Signin success";
    }
  };

  const getStepDescription = (step: Step) => {
    switch (step) {
      case "email":
        return "Enter your email address and we'll send you a verification code";
      case "code":
        return `We've sent a 6-digit code to ${email}`;
      case "success":
        return "Login successfully, redirected to dashboard shortly";
    }
  };

  return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            {getStepIcon(currentStep)}
          </div>
          <CardTitle className="text-2xl font-bold">
            {getStepTitle(currentStep)}
          </CardTitle>
          <CardDescription>{getStepDescription(currentStep)}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {/* {error && <span className="text-red-500">error</span>} */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </form>
          )}

          {currentStep === "code" && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={handleCodePaste}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      required
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || code.some((digit) => !digit)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>
              
            </form>
          )}

          {currentStep !== "success" && (
            <div className="mt-6">
              <div className="flex justify-center space-x-2">
                {["email", "code"].map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full ${
                      ["email", "code", "password"].indexOf(currentStep) >=
                      index
                        ? "bg-gray-900"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
        </CardContent>
        <div className="text-center text-sm text-black">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={onSignUpClick}
                  type="button"
                >
                  Sign up
                </Button>
              </div>
      </Card>
  );
}
