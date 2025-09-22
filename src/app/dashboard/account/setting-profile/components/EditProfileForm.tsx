"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChangeEmail } from "@/hooks/api/account/useChangeEmail";
import useChangePassword from "@/hooks/api/account/useChangePassword";
import useGetTenant from "@/hooks/api/account/useGetTenant";
import { useUpdateTenant } from "@/hooks/api/account/useUpdateTenant";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";

import {
  AlertCircle,
  Banknote,
  Building,
  Building2,
  Camera,
  CheckCircle,
  CreditCard,
  Lock,
  Mail,
  Phone,
  Save,
} from "lucide-react";
import Image from "next/image";

const EditProfileForm = () => {
  const { data: session, status } = useSession();
  const changePasswordMutation = useChangePassword();
  const { mutate: changeEmail, isPending } = useChangeEmail();
  const { data: tenant, isLoading: isTenantLoading } = useGetTenant();
  const { mutate: updateTenant, isPending: isUpdateTenantPending } =
    useUpdateTenant();

  const [displayName, setDisplayName] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formEmail, setFormEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [tenantName, setTenantName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [tenantImageFile, setTenantImageFile] = useState<File | null>(null);
  const [tenantPreviewImage, setTenantPreviewImage] = useState<string | null>(
    null
  );
  const [tenantImage, setTenantImage] = useState("/images/placeholder.png");

  useEffect(() => {
    if (session?.user) {
      setDisplayEmail(session.user.email || "");
      setFormEmail(session.user.email || "");
      setIsEmailVerified(session.user.isVerified || false);
    }
  }, [session]);

  useEffect(() => {
    if (tenant) {
      setTenantName(tenant.name || "");
      setDisplayName(tenant.name || "");
      setPhoneNumber(tenant.phone || "");
      setBankName(tenant.bankName || "");
      setBankNumber(tenant.bankNumber || "");
      setTenantImage(tenant.imageUrl || "/images/placeholder.png");
    }
  }, [tenant]);

  if (status === "loading" || isTenantLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-2 text-xl font-semibold">
              Authentication Required
            </h2>
            <p className="mt-2 text-gray-500">
              Please sign in to access your profile settings.
            </p>
            <Button className="mt-4">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields to continue.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match. Please try again.");
      return;
    }

    changePasswordMutation.mutate(
      {
        oldPassword: currentPassword,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          toast.success("Your password has been changed successfully.");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to update password.");
        },
      }
    );
  };

  const handleEmailUpdate = () => {
    changeEmail(
      { email: formEmail },
      {
        onSuccess: () => {
          setDisplayEmail(formEmail);
          setIsEmailVerified(false);
          toast.success("Email updated. Please check your inbox to verify.");
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to update email.");
        },
      }
    );
  };

  const handleTenantImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTenantImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setTenantPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTenantUpdate = async () => {
    try {
      await updateTenant(
        {
          name: tenantName,
          phone: phoneNumber,
          bankName,
          bankNumber,
          imageFile: tenantImageFile,
        },
        {
          onSuccess: () => {
            setDisplayName(tenantName);
            if (tenantImageFile) setTenantPreviewImage(null);
            toast.success("Tenant information updated successfully.");
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update tenant profile.");
          },
        }
      );
    } catch (error) {
      console.error("Error updating tenant profile:", error);
      toast.error("Something went wrong while updating tenant profile.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="overflow-hidden border-none shadow-md">
        <div className="relative h-32 bg-[#0290d1] sm:h-48">
          <Image
            src="/assets/ho.webp"
            alt="Logo"
            width={100}
            height={100}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <div className="absolute -bottom-16 left-6 sm:-bottom-20 sm:left-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md sm:h-40 sm:w-40">
                <AvatarImage
                  src={tenantPreviewImage || tenantImage}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary text-lg text-white sm:text-xl">
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="tenant-avatar-upload"
                className="absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/90 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10"
              >
                <Camera size={16} className="sm:size-20" />
                <input
                  id="tenant-avatar-upload"
                  type="file"
                  className="hidden"
                  onChange={handleTenantImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        <CardContent className="mt-16 pt-4 sm:mt-20">
          <div className="mb-2 flex items-center">
            <h2 className="text-xl font-bold sm:text-2xl text-[#0290d1]">
              {displayName}
            </h2>
            {isEmailVerified ? (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" /> Verified
              </span>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{displayEmail}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="tenant" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted/50">
          <TabsTrigger
            value="tenant"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Building size={16} className="text-[#0290d1]" />
            <span className="hidden sm:inline text-[#0290d1]">Tenant Info</span>
            <span className="sm:hidden text-[#0290d1]">Tenant</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Lock size={16} className="text-[#0290d1]" />
            <span className="hidden sm:inline text-[#0290d1]">Security</span>
            <span className="sm:hidden text-[#0290d1]">Password</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Mail size={16} className="text-[#0290d1]" />
            <span className="text-[#0290d1]">Email</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="tenant">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-[#0290d1]">
                  Tenant Information
                </CardTitle>
                <CardDescription>Update your tenant profile</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2 ">
                    <Label
                      htmlFor="tenantName"
                      className="text-sm font-medium text-[#0290d1]"
                    >
                      <Building2 size={16} className="mr-1 inline" />
                      Business Name
                    </Label>
                    <Input
                      id="tenantName"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-2 ">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-[#0290d1]"
                    >
                      <Phone size={16} className="mr-1 inline" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                      placeholder="e.g. +62812345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bankName"
                      className="text-sm font-medium text-[#0290d1]"
                    >
                      <Banknote size={16} className="mr-1 inline" />
                      Bank Name
                    </Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                      placeholder="e.g. BCA, Mandiri, BNI"
                    />
                  </div>

                  <div className="space-y-2 ">
                    <Label
                      htmlFor="bankNumber"
                      className="text-sm font-medium text-[#0290d1]"
                    >
                      <CreditCard size={16} className="mr-1 inline" />
                      Bank Account Number
                    </Label>
                    <Input
                      id="bankNumber"
                      value={bankNumber}
                      onChange={(e) => setBankNumber(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                      placeholder="Your bank account number"
                    />
                  </div>
                  <div className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={isUpdateTenantPending}
                          className="mt-2 px-6 bg-[#0290d1] hover:bg-[#60a4c4]"
                        >
                          {isUpdateTenantPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <Save className="h-5 w-5 " />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Update Tenant Profile
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to update your tenant business
                            information?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleTenantUpdate}
                            className="rounded-md bg-primary font-semibold hover:bg-primary/90"
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-[#0290d1]">
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-medium text-[#0290d1]"
                    >
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-[#0290d1]"
                    >
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-[#0290d1]"
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="pt-2 ">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="px-6 bg-[#0290d1] hover:bg-[#60a4c4]"
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <Save className="h-5 w-5" />
                          Update Password
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Change Password</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to change your password?
                            You'll need to use the new password next time you
                            log in.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handlePasswordUpdate}
                            className="rounded-md bg-primary font-semibold hover:bg-primary/90"
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-[#0290d1]">
                  Email Settings
                </CardTitle>
                <CardDescription>
                  Update or verify your email address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-[#0290d1]"
                      >
                        Email Address
                      </Label>
                      {isEmailVerified ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                          <AlertCircle className="mr-1 h-3 w-3" /> Pending
                          verification
                        </span>
                      )}
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="flex-1 bg-[#0290d1] hover:bg-[#60a4c4]"
                          disabled={isPending}
                        >
                          {isPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <Save className="h-5 w-5" />
                          Update Email
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Update Email</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to update your email address?
                            You will need to verify your new email.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleEmailUpdate}
                            className="rounded-md bg-primary font-semibold hover:bg-primary/90"
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {!isEmailVerified && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-200"
                          >
                            Resend Verification
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Resend Verification Email
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Would you like to resend the verification email to{" "}
                              {formEmail}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-md">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction className="rounded-md bg-primary font-semibold hover:bg-primary/90">
                              Send Email
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {!isEmailVerified && (
                    <Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Verification Required</AlertTitle>
                      <AlertDescription>
                        Please verify your email address to access all features
                        and receive important notifications.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EditProfileForm;
