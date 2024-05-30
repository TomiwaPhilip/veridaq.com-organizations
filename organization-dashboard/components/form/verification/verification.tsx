"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form/input";

import { NoOutlineButtonBig } from "@/components/shared/buttons";
import { updateUser2 } from "@/lib/actions/onboarding.action";

function Verification() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [disable, setDisable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const VerificationValidation = z.object({
    registered: z
      .string()
      .min(1, { message: "Registration details is required" }),
    credential: z.string().optional(),
    nin: z.string().optional(),
    credentialType: z
      .string()
      .min(1, { message: "Document type is required!" }),
  });

  const form = useForm<z.infer<typeof VerificationValidation>>({
    resolver: zodResolver(VerificationValidation),
  });

  const handleImage = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();
    console.log("I touched here");
    setDisable(true);
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
          setDisable(false);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };
    fileReader.readAsDataURL(file);
  };

  const onSubmit = async (data: z.infer<typeof VerificationValidation>) => {
    console.log(data);
    const result = await updateUser2(data);
    if (result) {
      router.push("/settings");
    } else {
      setErrorMessage("Credentials incomplete!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-11/12 md:w-5/6 lg:w-2/3 xl:w-1/2 text-white mt-[50px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="registered"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-[16px] mb-10">
                    Is your Company Registered?
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-center font-bold text-sm mt-10">
              If your organization is not registered, input your National
              Identity Details. If your organization is registered input either
              your Company Incorporation Number or upload a stamped
              authorization letter (you only need to do one of these).
            </h3>

            <FormField
              control={form.control}
              name="credential"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-[20px]">
                    Company Incorporation Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="RC124353" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credential"
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
                      placeholder="Upload Profile Photo"
                      className="account-form_image-input"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <h2 className="text-center text-sm font-bold">Or</h2>

            <FormField
              control={form.control}
              name="nin"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-[20px]">
                    National Identity Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="1536383899887773434777" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentialType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-[16px]">
                    Document Type
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nin">NIN</SelectItem>
                      <SelectItem value="cac">
                        Certificate of Incorporation
                      </SelectItem>
                      <SelectItem value="letter">
                        Letter of Authorization
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm font-bol text-red-500"> {errorMessage} </p>
            <div className="text-center">
              <NoOutlineButtonBig
                type="submit"
                name="Save and Continue"
                disabled={disable}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Verification;
