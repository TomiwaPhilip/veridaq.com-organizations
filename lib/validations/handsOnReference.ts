import { z } from "zod";

export const HandsOnReferenceValidation = z.object({
  firstName: z.string().min(1, {
    message: "First Name must be at least 1 character.",
  }),
  lastName: z.string().min(1, {
    message: "Last Name must be at least 1 character.",
  }),
  middleName: z.string().optional(), // Allow empty string
  roleType: z.string().min(1, {
    message: "Employee Type must be at least 1 characters.",
  }),
  subType: z.string().min(1, {
    message: "Sub Type must be at least 1 character.",
  }),
  identifier: z.string().min(1, {
    message: "Identifier must be at least 1 character.",
  }),
  projectTitle: z.string().min(1, {
    message: "Designation must be at least 1 character.",
  }),
  workStartDate: z.date().max(new Date(), {
    message: "Work Start Date must be a valid date in the past.",
  }),
  workEndDate: z.date().optional(),
  role: z.string().min(1, {
    message: "Department must be at least 1 character.",
  }),
  notableAchievement: z.string().max(30, "Notable Achievement must be at most 40 characters").optional(), // Allow empty string
  roleResponsibilities: z.string().min(1, {
    message: "Function must be at least 1 character.",
  }).max(40, {
    message: "Function must be at most 40 characters.",
  }),
  personalitySummary: z.string().max(30, "Personality Summary must be at most 40 characters").optional(), // Allow empty 
  image: z.string().url().optional(),
});