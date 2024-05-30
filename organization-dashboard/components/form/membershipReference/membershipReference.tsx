"use client";

import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/form/form";
import { Input } from "@/components/form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  createOrUpdateMembershipReference,
  getMemberReferenceById,
} from "@/lib/actions/request.action";
import { MembershipReferenceValidation3 } from "@/lib/validations/membershipreference";
import {
  SuccessMessage,
  ErrorMessage,
  useSession,
} from "@/components/shared/shared";
import { BlackButton } from "@/components/shared/buttons";

interface membershipReferenceProps {
  docId?: string | null;
}

const MembershipReference: React.FC<membershipReferenceProps> = ({ docId }) => {
  const [step, setStep] = useState(1);
  const [requestResult, setRequestResult] = useState<boolean | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isImageDisabled, setIsImageDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = useSession();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const form = useForm<z.infer<typeof MembershipReferenceValidation3>>({
    resolver: zodResolver(MembershipReferenceValidation3),
  });

  console.log(form.formState.errors);

  useEffect(() => {
    const fetchMemeberReferenceDoc = async () => {
      if (!docId) return;
      try {
        const doc = await getMemberReferenceById(docId);
        console.log("Fetched document:", doc); // Log fetched document
        // Set default values for form fields if available
        if (doc) {
          const { firstName, lastName, middleName, id, memberSince, image } =
            doc;
          form.reset({
            firstName,
            lastName,
            middleName,
            id,
            memberSince,
            image,
          });
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        // Handle error state if needed
      }
    };

    fetchMemeberReferenceDoc();
  }, [docId]);

  const handleImage = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    fileReader.onload = async (e) => {
      const fileData = e.target?.result;
      if (typeof fileData === "string") {
        try {
          const newBlob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/avatar/upload",
          });

          // Update the form data with the new blob URL
          fieldChange(newBlob.url);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };

    fileReader.readAsDataURL(file);
  };

  const onSubmit = async (
    data: z.infer<typeof MembershipReferenceValidation3>,
  ) => {
    console.log("I want to submit");

    setLoading(true);
    try {
      const create = await createOrUpdateMembershipReference({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        alumniCategory: data.alumniCategory,
        id: data.id,
        memberSince: data.memberSince,
        image: data.image,
        _id: docId as string,
      });
      setRequestResult(create);
      if (create) {
        handleNextStep();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setRequestResult(false);
      setLoading(false);
    }
  };

  if (session?.role !== "admin" && session?.role !== "memStatusVeridaqRole") {
    return (
      <p className="font-bold text-md text-center min-h-screen mt-[25%] p-5">
        {" "}
        You are not authorized to issue this kind of Veridaq
      </p>
    );
  }

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <div>
              <div className="mt-4 w-full px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="font-medium text-[16px]">
                          Firstname
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Lastname
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Middle Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Fred" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Identifier (No., Dept., Role)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="D11234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="memberSince"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-medium text-[16px]">
                          Member/Alumni Since
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "flex h-12 w-full normal-border bg-[#C3B8D8] pt-10 rounded-lg px-1 py-3 placeholder:text-gray-500 text-left disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alumniCategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Alumni Category
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Post Graduate" {...field} />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          {" "}
                          (Leave blank if not an Alumni ){" "}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="account-form_image-label">
                          {field.value ? (
                            <Image
                              src={field.value}
                              alt="image"
                              width={96}
                              height={96}
                              priority
                              className="rounded-full aspect-square object-cover"
                            />
                          ) : (
                            <Image
                              src="/assets/icons/avatar.png"
                              alt="image"
                              width={96}
                              height={96}
                              className="rounded-full aspect-square object-cover"
                            />
                          )}
                        </FormLabel>
                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                          <Input
                            type="file"
                            accept="image/*"
                            ref={inputFileRef}
                            disabled={isImageDisabled}
                            placeholder="Upload Profile Photo"
                            className="account-form_image-input"
                            onChange={(e) => handleImage(e, field.onChange)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-10 flex items-center justify-center">
                  <div className="text-right right">
                    <BlackButton
                      name="Generate Veridaq"
                      type="submit"
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <p className="p-2">{`Step ${step}`}</p>
            </div>
          )}
          {step === 2 && (
            <div>
              {/* Render success or error component based on request result */}
              {requestResult === true && <SuccessMessage />}
              {requestResult === false && <ErrorMessage />}
            </div>
          )}
        </form>
      </Form>
    </main>
  );
};

export default MembershipReference;
