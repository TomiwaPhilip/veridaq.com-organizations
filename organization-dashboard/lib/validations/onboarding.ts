import { z } from "zod";

export const OnboardingValidation = z.object({
  orgName: z.string().min(1, {
    message: "Organization name must be at least 1 character.",
  }),
  adminFirstName: z.string().min(1, {
    message: "Firstname must be at least 1 character.",
  }),
  adminLastName: z.string().min(1, {
    message: "Lastname must be at least 1 character.",
  }),
  streetAddress: z.string().min(1, {
    message: "Street Address must be at least 1 characters.",
  }),
  city: z.string().min(1, {
    message: "City must be at least 1 characters.",
  }),
  postalCode: z.string().min(1, {
    message: "Postal code must be at least 1 characters.",
  }),
  country: z.string().min(1, {
    message: "Country must be at least 1 characters.",
  }),
  image: z.string().url().min(1),
});