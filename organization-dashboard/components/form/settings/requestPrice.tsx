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
import React, { useState } from "react";
import { updatePricingDetails } from "@/lib/actions/settings.action";

import { BlackButton } from "@/components/shared/buttons";
import { RequestPriceValidation } from "@/lib/validations/onboarding";
import StatusMessage from "@/components/shared/shared";

export interface RequestPriceInterface {
    studentStatusFee: number;
    docVerificationFee: number;
    membershipRefFee: number;
}

export default function RequestPrice(params: RequestPriceInterface) {
  const [disable, setDisable] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const form = useForm<z.infer<typeof RequestPriceValidation>>({
    resolver: zodResolver(RequestPriceValidation),
    defaultValues: {
      studentStatusFee: params.studentStatusFee,
      docVerificationFee: params.docVerificationFee,
      membershipRefFee: params.membershipRefFee,
    },
  });

  const onSubmit = async (data: z.infer<typeof RequestPriceValidation>) => {
    console.log(data);
    setDisable(true);
    const result = await updatePricingDetails(data);
    if(result) {
        setIsSuccessful(true);
    } else {
        setIsError(true)
    };
    setDisable(false)
  };
  
  return (
    <div className="text-[#38313A]">
      <div className="mt-[50px]">
        <p className="text-2xl font-bold mb-5">
          Request Pricing Customization
        </p>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex gap-[6.5rem] space-10 items-center justify-center">
                <FormField
                  control={form.control}
                  name="studentStatusFee"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Stundentship Status Reference Fee
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="4000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="docVerificationFee"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Document Verification Reference Fee
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-[6.5rem] space-10 items-center justify-center">
                <FormField
                  control={form.control}
                  name="membershipRefFee"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-medium text-[20px]">
                        Membership Reference Fee
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
      {isError ? <StatusMessage message="An Error occurred!" type="error" /> : null}
      {isSuccessful ? <StatusMessage message="Saved Successfully!" type="success" /> : null}
    </div>
  );
}
