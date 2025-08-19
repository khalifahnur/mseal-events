"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Mail, Phone, User } from "lucide-react";
import { useStaffSignUp } from "@/hooks/Authhook/authHook";

const StaffSignUpSchema = Yup.object().shape({
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .required("Phone number is required"),
});

export default function StaffSignupTab() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const signUpMutation = useStaffSignUp();

  const handleSubmit = async (values: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
  }) => {
    try {
      setLoading(true);
      const { ...submitData } = values;
      await signUpMutation.mutateAsync(submitData);

      toast({
        title: "Staff Registered Successfully!",
        description:
          "Staff account has been created and a validation code has been sent to their email.",
        variant: "default",
      });
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      toast({
        title: "Registration Failed",
        description:
          err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm ">
      <CardContent className="pt-6">
        <div className="flex items-center mb-6 space-x-3">
          <div className="bg-teal-100 p-2 rounded-full">
            <UserPlus className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Staff
            </h2>
            <p className="text-gray-500 text-sm">
              Register Staffs to provide them with access to the system
            </p>
          </div>
        </div>

        <Formik
          initialValues={{
            firstname: "",
            lastname: "",
            email: "",
            phoneNumber: "",
          }}
          validationSchema={StaffSignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstname"
                    className="text-gray-700 font-medium flex items-center"
                  >
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    First Name
                  </Label>
                  <Field
                    name="firstname"
                    as={Input}
                    type="text"
                    className={`mt-1 w-full transition-all duration-200 ${
                      touched.firstname && errors.firstname
                        ? "border-red-300 ring-red-100"
                        : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    }`}
                    placeholder="Enter first name"
                  />
                  <ErrorMessage
                    name="firstname"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastname"
                    className="text-gray-700 font-medium flex items-center"
                  >
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Last Name
                  </Label>
                  <Field
                    name="lastname"
                    as={Input}
                    type="text"
                    className={`mt-1 w-full transition-all duration-200 ${
                      touched.lastname && errors.lastname
                        ? "border-red-300 ring-red-100"
                        : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    }`}
                    placeholder="Enter last name"
                  />
                  <ErrorMessage
                    name="lastname"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 font-medium flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  Email Address
                </Label>
                <Field
                  name="email"
                  as={Input}
                  type="email"
                  className={`mt-1 w-full transition-all duration-200 ${
                    touched.email && errors.email
                      ? "border-red-300 ring-red-100"
                      : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  }`}
                  placeholder="example@restaurant.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-gray-700 font-medium flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  Phone Number
                </Label>
                <Field
                  name="phoneNumber"
                  as={Input}
                  type="text"
                  className={`mt-1 w-full transition-all duration-200 ${
                    touched.phoneNumber && errors.phoneNumber
                      ? "border-red-300 ring-red-100"
                      : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  }`}
                  placeholder="+254 7(123) 123-4567"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition-colors duration-300 mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Registering Staff...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add Staff
                  </span>
                )}
              </Button>

              <div className="text-center text-xs text-gray-500 mt-4 bg-gray-50 p-3 rounded-md border border-gray-100">
                <p>
                  A validation code will be sent to the Staff&apos;s email
                  address. They will need this code to complete their account
                  setup.
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
