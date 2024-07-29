"use client";

import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createOrUpdateHandsOnReferenceRequest,
  getHandsOnReferenceById,
} from "@/lib/actions/request.action";
import {
  SuccessMessage,
  ErrorMessage,
  useSession,
} from "@/components/shared/shared";
import { BlackButton } from "@/components/shared/buttons";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { HandsOnReferenceValidation } from "@/lib/validations/handsOnReference";

interface HandsOnReferenceProps {
  docId?: string | null;
}

const HandsOnReference: React.FC<HandsOnReferenceProps> = ({ docId }) => {
  const [step, setStep] = useState(1);
  const [requestResult, setRequestResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const [uploading, setUploading] = useState(
    "Attach supporting documents (optional)",
  );

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const form = useForm<z.infer<typeof HandsOnReferenceValidation>>({
    resolver: zodResolver(HandsOnReferenceValidation),
  });

  console.log(form.formState.errors);

  useEffect(() => {
    const fetchWorkReferenceDoc = async () => {
      if (!docId) return;
      try {
        const doc = await getHandsOnReferenceById(docId);
        console.log("Fetched document:", doc); // Log fetched document
        // Set default values for form fields if available
        if (doc) {
          const {
            firstName,
            lastName,
            middleName,
            roleType,
            subType,
            identifier,
            projectTitle,
            image,
            workStartDate,
            workEndDate,
            role,
            notableAchievement,
            roleResponsibilities,
            personalitySummary,
          } = doc;
          form.reset({
            firstName,
            lastName,
            middleName,
            roleType,
            subType,
            identifier,
            projectTitle,
            image,
            workStartDate,
            workEndDate,
            role,
            notableAchievement,
            roleResponsibilities,
            personalitySummary,
          });
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        // Handle error state if needed
      }
    };

    fetchWorkReferenceDoc();
  }, [docId]);

  const handleImage = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();
    setUploading("Uploading Document");

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
          if (newBlob.url) {
            setUploading("Document uploaded!");
            // Update the form data with the new blob URL
            fieldChange(newBlob.url);
          } else {
            setUploading("Error Uploading Documents!");
          }
        } catch (error) {
          setUploading("Error Uploading Documents!");
          console.error("Error uploading file:", error);
        }
      }
    };

    fileReader.readAsDataURL(file);
  };

  const onSubmit = async (data: z.infer<typeof HandsOnReferenceValidation>) => {
    console.log("I want to submit");
    setLoading(true);
    try {
      const create = await createOrUpdateHandsOnReferenceRequest(data);
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

  if (session?.role !== "admin" && session?.role !== "workRefVeridaqRole") {
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
                    name="roleType"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Role Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Role Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Trainee">Trainee</SelectItem>
                            <SelectItem value="Team Member">
                              Team Member
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subType"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Sub Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Sub Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Identifier No.
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
                    name="projectTitle"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Project/Program Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Development Internship"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="text-[#3344A8] cursor-pointer text-[20px] font-medium">
                          {uploading}
                        </FormLabel>{" "}
                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                          <Input
                            type="file"
                            accept="image/*,application/pdf"
                            ref={inputFileRef}
                            placeholder="Upload Profile Photo or PDF"
                            className="hidden"
                            onChange={(e) => handleImage(e, field.onChange)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5 grid grid-cols-2 items-center justify-center">
                  <div className="text-left left">
                    <button
                      type="button"
                      className="mr-auto md:mr-0"
                      onClick={handlePrevStep}
                    >
                      Previous
                    </button>
                  </div>
                  <div className="text-right right">
                    <button
                      type="button"
                      className="bg-[#38313A] px-7 py-5 rounded-md text-white"
                      onClick={handleNextStep}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
              <p className="p-2">{`Step ${step}`}</p>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="mt-4 w-full px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                  <FormField
                    control={form.control}
                    name="workStartDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-medium text-[16px]">
                          Start Date
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
                    name="workEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-medium text-[16px]">
                          End Date (Leave blank if ongoing)
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                          Role
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Junior Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notableAchievement"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Notable Achievement</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notable Achievement"
                            id="notableAchievement"
                            className="flex h-12 w-full normal-border bg-[#C3B8D8] pt-10 rounded-lg px-1 py-3 placeholder:text-gray-500 text-left disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roleResponsibilities"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Role Responsibilities</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Role Responsibilities"
                            id="roleResponsibilities"
                            className="flex h-12 w-full normal-border bg-[#C3B8D8] pt-10 rounded-lg px-1 py-3 placeholder:text-gray-500 text-left disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalitySummary"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Personality Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Personality Summary"
                            id="personalitySummary"
                            className="flex h-12 w-full normal-border bg-[#C3B8D8] pt-10 rounded-lg px-1 py-3 placeholder:text-gray-500 text-left disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5 grid grid-cols-2 items-center justify-center">
                  <div className="text-left left">
                    <button
                      type="button"
                      className="mr-auto md:mr-0"
                      onClick={handlePrevStep}
                    >
                      Previous
                    </button>
                  </div>
                  <div className="text-right right">
                    <BlackButton
                      name="Generate Veridaq"
                      type="submit"
                      disabled={loading}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <p className="p-2">{`Step ${step}`}</p>
            </div>
          )}

          {step === 3 && (
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

export default HandsOnReference;
