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
  image: z.string().url().optional(),
});

export const BankDetailsValidation = z.object({
  accountName: z.string().min(1, {
    message: "Account name must be at least 1 character.",
  }),
  accountNumber: z.coerce.number().min(1, {
    message: "Account number must be at least 1 character.",
  }),
  bankCode: z.coerce.number().min(1, {
    message: "Bank code must be at least 1 character.",
  }),
});

export const RequestPriceValidation = z.object({
  studentStatusFee: z.coerce.number().min(2000, {
    message: "Studentship Status Fee must be at least 2000 character.",
  }),
  docVerificationFee: z.coerce.number().min(3000, {
    message: "Document Verification Fee must be at least 3000 character.",
  }),
  membershipRefFee: z.coerce.number().min(3000, {
    message: "Membership Reference must be at least 3000 character.",
  }),
});

export const TeamMemberValidation = z.object({
  firstName: z.string().min(1, {
    message: "Firstname must be at least 1 character.",
  }),
  lastName: z.string().min(1, {
    message: "Lastname must be at least 1 character.",
  }),
  designation: z.string().min(1, {
    message: "Designation must be at least 1 character.",
  }),
  role: z.string().min(1, {
    message: "Role must be at least 1 character.",
  }),
  email: z.string().min(3, {
    message: "Email must be at least 3 characters.",
  }),
});
