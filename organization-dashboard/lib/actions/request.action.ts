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
  id?: string;
}

export async function createOrUpdateWorkReferenceRequest({
  id,
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
  jobFunction,
  personalitySummary,
}: Params) {
  try {
    // Connect to the database
    connectToDB();

    console.log(id);

    // If id is provided, find and update the document
    if (id) {
      await WorkReference.findByIdAndUpdate(
        id,
        {
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
          jobFunction,
          personalitySummary,
          issued: true,
          dateIssued: new Date(),
        },
        { new: true },
      );
      return true; // Return true if update is successful
    } else {
      // If id is not provided, create a new document
      const session = await getSession();

      if (!session) {
        throw new Error("Unauthorized");
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
        jobFunction,
        personalitySummary,
        issued: true,
        dateIssued: new Date(),
      });

      // Save the WorkReference document to the database
      await workReference.save();
      return true; // Return true if creation is successful
    }
  } catch (error: any) {
    throw new Error(
      `Failed to save/update WorkReference request: ${error.message}`,
    );
  }
}

interface StudentshipParams {
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
  id?: string;
}

// Define the createStudentshipStatus function
export async function createOrUpdateStudentshipStatus(
  params: StudentshipParams,
) {
  try {
    // Connect to the database
    connectToDB();

    console.log(params.id);

    // If id is provided, find and update the document
    if (params.id) {
      await StudentshipStatus.findByIdAndUpdate(
        params.id,
        {
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
          issued: true,
          dateIssued: new Date(),
        },
        { new: true },
      );
      return true; // Return true if update is successful
    } else {
      // If id is not provided, create a new document
      const session = await getSession();

      if (!session) {
        throw new Error("Unauthorized");
      }

      const orgId = session.orgId;

      // Create a new WorkReference document
      const studentshipStatus = new StudentshipStatus({
        orgId: orgId,
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
        issued: true,
        dateIssued: new Date(),
      });

      // Save the WorkReference document to the database
      await studentshipStatus.save();
      return true; // Return true if creation is successful
    }
  } catch (error: any) {
    throw new Error(
      `Failed to save/update StudentshipStatus request: ${error.message}`,
    );
  }
}

interface MembershipParams {
  firstName: string;
  lastName: string;
  middleName?: string;
  id: string;
  info: string;
  image?: string;
  _id?: string;
}

// Define the Membership Reference function
export async function createOrUpdateMembershipReference(
  params: MembershipParams,
) {
  try {
    // Connect to the database
    connectToDB();

    console.log(params._id);

    // If id is provided, find and update the document
    if (params._id) {
      await MembershipReference.findByIdAndUpdate(
        params._id,
        {
          firstName: params.firstName,
          lastName: params.lastName,
          middleName: params.middleName,
          id: params.id,
          info: params.info,
          image: params.image,
          issued: true,
          dateIssued: new Date(),
        },
        { new: true },
      );
      return true; // Return true if update is successful
    } else {
      // If id is not provided, create a new document
      const session = await getSession();

      if (!session) {
        throw new Error("Unauthorized");
      }

      const orgId = session.orgId;

      // Create a new WorkReference document
      const membershipReference = new MembershipReference({
        orgId: orgId,
        firstName: params.firstName,
        lastName: params.lastName,
        middleName: params.middleName,
        id: params.id,
        info: params.info,
        image: params.image,
        issued: true,
        dateIssued: new Date(),
      });

      // Save the WorkReference document to the database
      await membershipReference.save();
      return true; // Return true if creation is successful
    }
  } catch (error: any) {
    throw new Error(
      `Failed to save/update membershipReference request: ${error.message}`,
    );
  }
}

interface DocumentParams {
  firstName: string;
  lastName: string;
  middleName?: string;
  id: string;
  info: string;
  image?: string;
  _id?: string;
}

// Define the createDocumentVerificationRequest function
export async function createOrUpdateDocumentVerificationRequest(
  params: DocumentParams,
) {
  try {
    // Connect to the database
    connectToDB();

    console.log(params._id);

    // If id is provided, find and update the document
    if (params._id) {
      await DocumentVerification.findByIdAndUpdate(
        params._id,
        {
          firstName: params.firstName,
          lastName: params.lastName,
          middleName: params.middleName,
          documentType: params.id, // Assuming id in MembershipParams corresponds to documentType
          documentName: params.info, // Assuming info in MembershipParams corresponds to documentName
          id: params.id,
          info: params.info,
          image: params.image, // Default to empty string if image is not provided
          issued: true,
          dateIssued: new Date(),
        },
        { new: true },
      );
      return true; // Return true if update is successful
    } else {
      // If id is not provided, create a new document
      const session = await getSession();

      if (!session) {
        throw new Error("Unauthorized");
      }

      const orgId = session.orgId;

      // Create a new WorkReference document
      const documentVerification = new DocumentVerification({
        orgId: orgId,
        firstName: params.firstName,
        lastName: params.lastName,
        middleName: params.middleName,
        documentType: params.id, // Assuming id in MembershipParams corresponds to documentType
        documentName: params.info, // Assuming info in MembershipParams corresponds to documentName
        id: params.id,
        info: params.info,
        image: params.image, // Default to empty string if image is not provided
        issued: true,
        dateIssued: new Date(),
      });

      // Save the WorkReference document to the database
      await documentVerification.save();
      return true; // Return true if creation is successful
    }
  } catch (error: any) {
    throw new Error(
      `Failed to save/update DocumentVerification request: ${error.message}`,
    );
  }
}

// Helper function to format the date as "DD-MM-YYYY"
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
}

export async function getWorkReference() {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the WorkReference collection based on orgId
    const workReferences = await WorkReference.find({
      orgId,
      issued: false,
    }).select("firstName lastName dateRequested");

    // Format the data before returning to the frontend
    const formattedData = workReferences.map((doc) => ({
      DocDetails: `Work Reference Veridaq Request from ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      DocDate: formatDate(doc.dateRequested), // Format the date
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch WorkReference documents");
  }
}

export async function getWorkReferenceById(docId: string) {
  try {
    // Connect to the database
    connectToDB();

    // Query the WorkReference collection based on the provided docId
    const workReference = await WorkReference.findById(docId);

    if (!workReference) {
      throw new Error("Document not found");
    }

    // Convert the MongoDB _id field and other IDs to string
    const stringifiedWorkReference = {
      ...workReference.toJSON(),
      _id: workReference._id.toString(), // Convert _id to string
      orgId: workReference.orgId.toString(), // Convert orgId to string
      user: workReference.user.toString(), // Convert user ID to string
    };

    // console.log(stringifiedWorkReference);

    return stringifiedWorkReference;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to fetch WorkReference document with ID: ${docId}`);
  }
}

export async function getDocVerification() {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the WorkReference collection based on orgId
    const docVerification = await DocumentVerification.find({
      orgId,
      issued: false,
    }).select("firstName lastName dateRequested");

    // Format the data before returning to the frontend
    const formattedData = docVerification.map((doc) => ({
      DocDetails: `Document Verification Veridaq Request from ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      DocDate: formatDate(doc.dateRequested), // Format the date
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch WorkReference documents");
  }
}

export async function getDocVerificationById(docId: string) {
  try {
    // Connect to the database
    connectToDB();

    // Query the WorkReference collection based on the provided docId
    const docVerification = await DocumentVerification.findById(docId);

    if (!docVerification) {
      throw new Error("Document not found");
    }

    // Convert the MongoDB _id field and other IDs to string
    const stringifiedDocVerification = {
      ...docVerification.toJSON(),
      _id: docVerification._id.toString(), // Convert _id to string
      orgId: docVerification.orgId.toString(), // Convert orgId to string
      user: docVerification.user.toString(), // Convert user ID to string
    };

    // console.log(stringifiedWorkReference);

    return stringifiedDocVerification;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to fetch document with ID: ${docId}`);
  }
}

export async function getMemberReference() {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the WorkReference collection based on orgId
    const memberReference = await MembershipReference.find({
      orgId,
      issued: false,
    }).select("firstName lastName dateRequested");

    // Format the data before returning to the frontend
    const formattedData = memberReference.map((doc) => ({
      DocDetails: `Membership Reference Veridaq Request from ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      DocDate: formatDate(doc.dateRequested), // Format the date
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch WorkReference documents");
  }
}

export async function getMemberReferenceById(docId: string) {
  try {
    // Connect to the database
    connectToDB();

    // Query the WorkReference collection based on the provided docId
    const memberReference = await MembershipReference.findById(docId);

    if (!memberReference) {
      throw new Error("Document not found");
    }

    // Convert the MongoDB _id field and other IDs to string
    const stringifiedMemberReference = {
      ...memberReference.toJSON(),
      _id: memberReference._id.toString(), // Convert _id to string
      orgId: memberReference.orgId.toString(), // Convert orgId to string
      user: memberReference.user.toString(), // Convert user ID to string
    };

    // console.log(stringifiedWorkReference);

    return stringifiedMemberReference;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Failed to fetch MemberReference document with ID: ${docId}`,
    );
  }
}

export async function getStudentshipStatus() {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the WorkReference collection based on orgId
    const studentshipStatus = await StudentshipStatus.find({
      orgId,
      issued: false,
    }).select("firstName lastName dateRequested");

    // Format the data before returning to the frontend
    const formattedData = studentshipStatus.map((doc) => ({
      DocDetails: `Studentship Status Veridaq Request from ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      DocDate: formatDate(doc.dateRequested), // Format the date
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch studentshipStatus documents");
  }
}

export async function getStudentshipStatusById(docId: string) {
  try {
    // Connect to the database
    connectToDB();

    // Query the WorkReference collection based on the provided docId
    const studentshipStatus = await StudentshipStatus.findById(docId);

    if (!studentshipStatus) {
      throw new Error("Document not found");
    }

    // Convert the MongoDB _id field and other IDs to string
    const stringifiedStudentshipStatus = {
      ...studentshipStatus.toJSON(),
      _id: studentshipStatus._id.toString(), // Convert _id to string
      orgId: studentshipStatus.orgId.toString(), // Convert orgId to string
      user: studentshipStatus.user.toString(), // Convert user ID to string
    };

    // console.log(stringifiedWorkReference);

    return stringifiedStudentshipStatus;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      `Failed to fetch StudentshipStatus document with ID: ${docId}`,
    );
  }
}
