"use client";

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
import { Input } from "@/components/form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import {
  updateBankDetails,
  updateOrgRole,
} from "@/lib/actions/settings.action";

import { BlackButton } from "@/components/shared/buttons";
import { TeamMemberValidation } from "@/lib/validations/onboarding";

interface ModalForm {
  onClose: () => void;
}

const ModalForm: React.FC<ModalForm> = ({ onClose }) => {
  const [disable, setDisable] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const form = useForm<z.infer<typeof TeamMemberValidation>>({
    resolver: zodResolver(TeamMemberValidation),
  });

  const onSubmit = async (data: z.infer<typeof TeamMemberValidation>) => {
    console.log(data);
    setDisable(true);
    const result = await updateOrgRole(data);
    if (result) {
      setIsForm(false);
      setIsSuccessful(true);
    } else {
      setIsForm(false);
      setIsError(true);
    }
    setDisable(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg normal-border p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-2xl font-bold mb-5">Add Team Member</p>
        {isForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex gap-[6.5rem] space-10 items-center justify-center">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        First Name
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
                      <FormLabel className="font-medium text-[20px]">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-[6.5rem] space-10 items-center justify-center">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Designation
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="HR Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-[6.5rem] space-10 items-center justify-center">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          <SelectItem value="workRefVeridaqRole">
                            Work Reference Admin
                          </SelectItem>
                          <SelectItem value="stdStatusVeridaqRole">
                            Studentship Status Admin
                          </SelectItem>
                          <SelectItem value="docRefVeridaqRole">
                            Document Verification Admin
                          </SelectItem>
                          <SelectItem value="memStatusVeridaqRole">
                            Membership Reference Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <BlackButton
                  type="submit"
                  name="Add Team Member"
                  disabled={disable}
                />
              </div>
            </form>
          </Form>
        ) : isSuccessful ? (
          <p className="font-bold text-lg">
            Team Member has been added successfully! <br /> They have been sent
            an email instructing them about how to start working on your
            Organization on Veridaq.
          </p>
        ) : isError ? (
          <p className="font-bold text-lg">
            An Error occured. Review the email address and try again or contact
            support.
          </p>
        ) : (
          <p>No conditions are true</p>
        )}
      </div>
    </div>
  );
};

export default ModalForm;
