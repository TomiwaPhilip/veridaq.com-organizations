"use server";

import getSession from "@/lib/actions/server-hooks/getsession.action";
import connectToDB from "../model/database";
import WorkReference from "../utils/workreference";
import StudentshipStatus from "../utils/studentshipstatus";
import DocumentVerification from "../utils/documentVerification";
import User from "../utils/user";
import MembershipReference from "../utils/membershipReference";

interface Params {
  firstName: string;
  lastName: string;
  middleName?: string; // Optional middleName field
  employeeType: string;
  subType: string;
  staffId: string;
  designation: string;
  workStartDate: Date;
  workEndDate: Date | undefined; // Nullable workEndDate field
  department: string;
  notableAchievement?: string; // Optional notableAchievement field
  jobFunction: string; // Renamed from 'function' to 'jobFunction'
  personalitySummary?: string; // Optional personalitySummary field
}

export async function createWorkReferenceRequest({
  firstName,
  lastName,
  middleName,
  employeeType,
  subType,
  staffId,
  designation,
  workStartDate,
  workEndDate,
  department,
  notableAchievement,
  jobFunction, // Changed from 'function' to 'jobFunction'
  personalitySummary,
}: Params) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    // Find the user in the User collection by email
    const user = await User.findOne({ email: session.email });

    if (!user) {
      throw new Error("User not found");
    }

    const orgId = session.orgId;

    // Create a new WorkReference document
    const workReference = new WorkReference({
      orgId,
      firstName,
      lastName,
      middleName,
      employeeType,
      subType,
      staffId,
      designation,
      workStartDate,
      workEndDate,
      department,
      notableAchievement,
      jobFunction, // Changed from 'function' to 'jobFunction'
      personalitySummary,
      user: user._id,
      issued: true,
    });

    // Save the WorkReference document to the database
    await workReference.save();
    return true;
  } catch (error: any) {
    throw new Error(`Failed to save WorkReference request: ${error.message}`);
  }
}

interface StudentshipParams {
  orgId: string;
  firstName: string;
  lastName: string;
  middleName?: string; // Optional middleName field
  currentLevel: string;
  courseOfStudy: string;
  studentId: string;
  info?: string; // Optional info field
  faculty: string;
  entryYear: Date;
  exitYear?: Date; // Optional exitYear field
  image: string;
}

// Define the createStudentshipStatus function
export async function createStudentshipStatus(params: StudentshipParams) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    // Find the user in the User collection by email
    const user = await User.findOne({ email: session.email });

    if (!user) {
      throw new Error("User not found");
    }

    // Create a new StudentshipStatus document
    const studentshipStatus = new StudentshipStatus({
      orgId: params.orgId,
      firstName: params.firstName,
      lastName: params.lastName,
      middleName: params.middleName,
      currentLevel: params.currentLevel,
      courseOfStudy: params.courseOfStudy,
      studentId: params.studentId,
      info: params.info,
      faculty: params.faculty,
      entryYear: params.entryYear,
      exitYear: params.exitYear,
      image: params.image,
      user: user._id,
    });

    // Save the StudentshipStatus document to the database
    await studentshipStatus.save();
    return true;
  } catch (error: any) {
    throw new Error(
      `Failed to save StudentshipStatus request: ${error.message}`,
    );
  }
}

interface MembershipParams {
  orgId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  id: string;
  info: string;
  image?: string;
}

// Define the Membership Reference function
export async function createMembershipReference(params: MembershipParams) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    // Find the user in the User collection by email
    const user = await User.findOne({ email: session.email });

    if (!user) {
      throw new Error("User not found");
    }

    // Create a new Memebership Reference document
    const membershipReference = new MembershipReference({
      orgId: params.orgId,
      firstName: params.firstName,
      lastName: params.lastName,
      middleName: params.middleName,
      id: params.id,
      info: params.info,
      image: params.image,
      user: user._id,
    });

    // Save the Memebership Reference document to the database
    await membershipReference.save();
    return true;
  } catch (error: any) {
    throw new Error(
      `Failed to save Membership Reference request: ${error.message}`,
    );
  }
}

interface DocumentParams {
  orgId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  id: string;
  info: string;
  image?: string;
}

// Define the createDocumentVerificationRequest function
export async function createDocumentVerificationRequest(
  params: DocumentParams,
) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    // Find the user in the User collection by email
    const user = await User.findOne({ email: session.email });

    if (!user) {
      throw new Error("User not found");
    }

    // Create a new Document Verification document
    const documentVerification = new DocumentVerification({
      orgId: params.orgId,
      firstName: params.firstName,
      lastName: params.lastName,
      middleName: params.middleName,
      documentType: params.id, // Assuming id in MembershipParams corresponds to documentType
      documentName: params.info, // Assuming info in MembershipParams corresponds to documentName
      id: params.id,
      info: params.info,
      image: params.image, // Default to empty string if image is not provided
      user: user._id,
    });

    // Save the Document Verification document to the database
    await documentVerification.save();
    return true;
  } catch (error: any) {
    throw new Error(
      `Failed to save Document Verification request: ${error.message}`,
    );
  }
}
