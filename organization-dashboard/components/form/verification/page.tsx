"use client";

import React, { useState } from 'react';
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
    } from "@/components/ui/select"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

function Verification() {
  // State to track whether the company is registered
  const [isRegistered, setIsRegistered] = useState(false);
    
  // State to store form data for registered companies
  const [registeredFormData, setRegisteredFormData] = useState({
        companyName: '',
        registrationNumber: '',
    });

    // State to store form data for unregistered companies
    const [unregisteredFormData, setUnregisteredFormData] = useState({
        companyName: '',
        reasonForNotRegistered: '',
      });

  // Function to handle selection of "Yes" or "No"
  const handleRegistrationSelection = (event: any) => {
    setIsRegistered(event.target.value === 'yes' ? true : false);
  };

  // Function to handle form submission for registered companies
  const handleRegisteredFormSubmit = (event: any) => {
    event.preventDefault();
    // Add code to handle form submission for registered companies
  };

  // Function to handle form submission for unregistered companies
  const handleUnregisteredFormSubmit = (event: any) => {
    event.preventDefault();
    // Add code to handle form submission for unregistered companies
  };

  const VerificationValidation = z.object({
    registered: z.boolean(),
    credential: z.string().url().min(1),
    credentialType: z.string(),})

  const form = useForm<z.infer<typeof VerificationValidation>>({
    resolver: zodResolver(VerificationValidation)});


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl mb-4">Is your company registered?</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="employeeType"
                render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel className='font-medium text-[16px]'>Employee Type</FormLabel>
                        <Select onValueChange={field.onChange} onChange={handleRegistrationSelection} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a Employee Type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
                />
            </form>
        </Form>        
        {/* <form className="space-y-4">
          <select
            className="border-gray-300 rounded-md p-2"
            onChange={handleRegistrationSelection}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </form> */}

        {/* Conditional rendering based on the registration status */}
        {isRegistered === true && (
                   <Form {...form}>
                   <form onSubmit={form.handleRegisteredFormSubmit} className="space-y-4">
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
                                  className="rounded-full object-contain"
                                />
                              ) : (
                                <Image
                                  src="/assets/icons/avatar.png"
                                  alt="image"
                                  width={96}
                                  height={96}
                                  className="object-contain"
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

                      <h2>Or</h2>
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
                                  className="rounded-full object-contain"
                                />
                              ) : (
                                <Image
                                  src="/assets/icons/avatar.png"
                                  alt="image"
                                  width={96}
                                  height={96}
                                  className="object-contain"
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
                      </form>
                      </Form>
                    )}
        {isRegistered === false && (
            <Form {...form}>
                   <form onSubmit={form.handleRegisteredFormSubmit} className="space-y-4"></form>
                    <FormField
                    control={form2.control}
                    name="personalitySummary"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormLabel className="font-medium text-[16px]">
                            Personality Summary
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Good" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </form>
                </Form>
        )}
      </div>
    </div>
  );
}

export default Verification;
