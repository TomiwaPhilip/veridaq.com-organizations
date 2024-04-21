"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form";
import { Input } from "@/components/form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useRef } from "react";
import { updateUser } from "@/lib/actions/onboarding.action";

import { BlackButton } from "@/components/shared/buttons";
import { BankDetailsValidation } from "@/lib/validations/onboarding";

export default function BankDetails() {
  const [disable, setDisable] = useState(true);

  const form = useForm<z.infer<typeof BankDetailsValidation>>({
    resolver: zodResolver(BankDetailsValidation),
    defaultValues: {
      accountName: "",
      accountNumber: 0,
      bankCode: 0,
    },
  });

  const onSubmit = async (data1: z.infer<typeof BankDetailsValidation>) => {
    console.log(data1);
    // await updateUser(data1);
  };
  
  return (
    <div className="text-[#38313A]">
      <div className="mt-[50px]">
        <p className="text-2xl font-bold mb-5">
          Bank Account Details
        </p>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex gap-[6.5rem] space-10 items-center justify-center">
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Account Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Company Ltd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Account Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-[6.5rem] space-10 items-center justify-center">
                <FormField
                  control={form.control}
                  name="bankCode"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Bank Code
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Floyd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <BlackButton
                  type="submit"
                  name="Save Changes"
                  disabled={disable}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
