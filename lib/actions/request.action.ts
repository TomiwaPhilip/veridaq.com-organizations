"use server";

import getSession from "@/lib/actions/server-hooks/getsession.action";
import connectToDB from "../model/database";
import WorkReference from "../utils/workreference";
import StudentshipStatus from "../utils/studentshipstatus";
import DocumentVerification from "../utils/documentVerification";
import {
  generateVeridaqID,
  concatenateDates,
  getCurrentDateTime,
} from "../utils";
import { getDocAndUpload } from "./server-hooks/requestWithUpload.action";
import MembershipReference from "../utils/membershipReference";
import Role from "../utils/roleSchema";
import HandsOnReference from "../utils/handsOnReference";

interface Params {
  firstName: string;
  lastName: string;
  middleName?: string; // Optional middleName field
  employeeType: string;
  subType: string;
  staffId: string;
  designation: string;
  image?: string;
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
  image,
  workStartDate,
  workEndDate,
  department,
  notableAchievement,
  jobFunction,
  personalitySummary,
}: Params) {
  try {
    console.log("Data got to backend");
    // Connect to the database
    connectToDB();

    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const orgId = session.orgId;
    const adminDesignation = session.designation;
    const adminName = (session.firstName + " " + session.lastName) as string;
    const orgName = session.orgName as string;
    const period = concatenateDates(workStartDate, workEndDate);
    const currentDateTime = getCurrentDateTime();
    const badgeID = generateVeridaqID();
    const issuingAdminDetails = session.userId;

    console.log(id);

    const data = {
      nameOfEmployee: firstName + " " + lastName,
      employeeID: staffId,
      employeeStatus: subType,
      nameOfInstitution: orgName,
      subType: employeeType,
      designation: designation,
      department: department,
      period: period,
      jobFunctions: jobFunction,
      notableAchievement: notableAchievement,
      personalitySummary: personalitySummary,
      nameOfAdmin: adminName,
      adminDesignation: adminDesignation,
      currentDateTime: currentDateTime,
      badgeID: badgeID,
    };
    const url =
      "https://generator-abfcaoddhq-bq.a.run.app/work-reference";
    const docName = "workReference.pdf";

    const result = await getDocAndUpload(data, url, docName);

    if (result) {
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
            image,
            workStartDate,
            workEndDate,
            department,
            notableAchievement,
            jobFunction,
            personalitySummary,
            issued: true,
            dateIssued: new Date(),
            badgeUrl: result,
            badgeID: badgeID,
            issuingAdminDetails,
          },
          { new: true },
        );

        return true; // Return true if update is successful
      } else {
        // If id is not provided, create a new document
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
          image,
          workStartDate,
          workEndDate,
          department,
          notableAchievement,
          jobFunction,
          personalitySummary,
          issued: true,
          dateIssued: new Date(),
          badgeUrl: result,
          badgeID: badgeID,
          issuingAdminDetails,
        });

        // Save the WorkReference document to the database
        await workReference.save();
        return true; // Return true if creation is successful
      }
    } else return false;
  } catch (error: any) {
    throw new Error(
      `Failed to save/update WorkReference request: ${error.message}`,
    );
  }
}

interface HandsOnReferenceParams {
  firstName: string;
  lastName: string;
  middleName?: string;
  roleType: string;
  subType: string;
  identifier: string;
  projectTitle: string;
  image?: string;
  workStartDate: Date;
  workEndDate?: Date; // Nullable workEndDate field
  role: string;
  notableAchievement?: string; // Optional notableAchievement field
  roleResponsibilities: string; // Renamed from 'function' to 'jobFunction'
  personalitySummary?: string; // Optional personalitySummary field
  id?: string;
}

export async function createOrUpdateHandsOnReferenceRequest({
  id,
  firstName,
  lastName,
  middleName,
  roleType,
  subType,
  identifier,
  projectTitle,
  image,
  workStartDate,
  workEndDate,
  role,
  notableAchievement,
  roleResponsibilities, // Changed from 'function' to 'jobFunction'
  personalitySummary,
}: HandsOnReferenceParams) {
  try {
    console.log("Data got to backend");
    // Connect to the database
    connectToDB();

    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const orgId = session.orgId;
    const adminDesignation = session.designation;
    const adminName = (session.firstName + " " + session.lastName) as string;
    const orgName = session.orgName as string;
    const period = concatenateDates(workStartDate, workEndDate);
    const currentDateTime = getCurrentDateTime();
    const badgeID = generateVeridaqID();
    const issuingAdminDetails = session.userId;

    console.log(id);

    // const data = {
    //   nameOfEmployee: firstName + " " + lastName,
    //   identifier: identifier,
    //   employeeStatus: subType,
    //   nameOfInstitution: orgName,
    //   subType: subType,
    //   designation: designation,
    //   department: department,
    //   period: period,
    //   jobFunctions: jobFunction,
    //   notableAchievement: notableAchievement,
    //   personalitySummary: personalitySummary,
    //   nameOfAdmin: adminName,
    //   adminDesignation: adminDesignation,
    //   currentDateTime: currentDateTime,
    //   badgeID: badgeID,
    // };
    // const url =
    //   "https://generator-abfcaoddhq-bq.a.run.app/work-reference";
    // const docName = "handsOnReference.pdf";

    // const result = await getDocAndUpload(data, url, docName);
    let result;
    if (result) {
      // If id is provided, find and update the document
      if (id) {
        await HandsOnReference.findByIdAndUpdate(
          id,
          {
            firstName,
            lastName,
            middleName,
            roleType,
            subType,
            identifier,
            projectTitle,
            image,
            workStartDate,
            workEndDate,
            role,
            notableAchievement,
            roleResponsibilities,
            personalitySummary,
            issued: true,
            dateIssued: new Date(),
            badgeUrl: result,
            badgeID: badgeID,
            issuingAdminDetails,
          },
          { new: true },
        );

        return true; // Return true if update is successful
      } else {
        // If id is not provided, create a new document
        // Create a new WorkReference document
        const handsOnReference = new HandsOnReference({
          orgId,
          firstName,
          lastName,
          middleName,
          roleType,
          subType,
          identifier,
          projectTitle,
          image,
          workStartDate,
          workEndDate,
          role,
          notableAchievement,
          roleResponsibilities,
          personalitySummary,          
          issued: true,
          dateIssued: new Date(),
          badgeUrl: result,
          badgeID: badgeID,
          issuingAdminDetails,
        });

        // Save the WorkReference document to the database
        await handsOnReference.save();
        return true; // Return true if creation is successful
      }
    } else return false;
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
  categoryOfStudy: string;
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

    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const orgId = session.orgId;
    const adminDesignation = session.designation;
    const adminName = (session.firstName + " " + session.lastName) as string;
    const orgName = session.orgName as string;
    const period = concatenateDates(params.entryYear, params.exitYear);
    const currentDateTime = getCurrentDateTime();
    const badgeID = generateVeridaqID();
    const issuingAdminDetails = session.userId;

    console.log(params.id);

    const data = {
      nameOfStudent: params.firstName + " " + params.lastName,
      studentID: params.studentId,
      nameOfInstitution: orgName,
      passportUrl: params.image,
      categoryOfStudy: params.categoryOfStudy,
      currentLevel: params.currentLevel,
      courseOfStudy: params.courseOfStudy,
      faculty: params.faculty,
      yearOfEntryAndExit: period,
      nameOfAdmin: adminName,
      adminDesignation: adminDesignation,
      currentDateTime: currentDateTime,
      badgeID: badgeID,
    };
    const url =
      "https://generator-abfcaoddhq-bq.a.run.app/student-status";
    const docName = "studentStatus.pdf";

    const result = await getDocAndUpload(data, url, docName);

    if (result) {
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
            categoryOfStudy: params.categoryOfStudy,
            studentId: params.studentId,
            info: params.info,
            faculty: params.faculty,
            entryYear: params.entryYear,
            exitYear: params.exitYear,
            image: params.image,
            issued: true,
            dateIssued: new Date(),
            badgeUrl: result,
            badgeID: badgeID,
            issuingAdminDetails,
          },
          { new: true },
        );
        return true; // Return true if update is successful
      } else {
        // Create a new WorkReference document
        const studentshipStatus = new StudentshipStatus({
          orgId: orgId,
          firstName: params.firstName,
          lastName: params.lastName,
          middleName: params.middleName,
          currentLevel: params.currentLevel,
          courseOfStudy: params.courseOfStudy,
          categoryOfStudy: params.categoryOfStudy,
          studentId: params.studentId,
          info: params.info,
          faculty: params.faculty,
          entryYear: params.entryYear,
          exitYear: params.exitYear,
          image: params.image,
          issued: true,
          dateIssued: new Date(),
          badgeUrl: result,
          badgeID: badgeID,
          issuingAdminDetails,
        });

        // Save the WorkReference document to the database
        await studentshipStatus.save();
        return true; // Return true if creation is successful
      }
    } else return false;
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
  memberSince: Date;
  alumniCategory?: string;
  image?: string;
  _id?: string;
  info?: string;
}

// Define the Membership Reference function
export async function createOrUpdateMembershipReference(
  params: MembershipParams,
) {
  try {
    // Connect to the database
    connectToDB();

    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const orgId = session.orgId;
    const adminDesignation = session.designation;
    const adminName = (session.firstName + " " + session.lastName) as string;
    const orgName = session.orgName as string;
    const period = concatenateDates(params.memberSince);
    const currentDateTime = getCurrentDateTime();
    const badgeID = generateVeridaqID();
    const issuingAdminDetails = session.userId;

    console.log(params.id);

    let result;

    if (!params.alumniCategory) {
      const data = {
        memberName: params.firstName + " " + params.lastName,
        memberID: params.id,
        nameOfInstitution: orgName,
        passportUrl: params.image,
        memberSince: period,
        nameOfOrganization: orgName,
        nameOfAdmin: adminName,
        adminDesignation: adminDesignation,
        currentDateTime: currentDateTime,
        badgeID: badgeID,
        moreInfo: params.info,
      };
      const url =
        "https://generator-abfcaoddhq-bq.a.run.app/member-reference";
      const docName = "memberReference.pdf";

      result = await getDocAndUpload(data, url, docName);
    } else {
      const data = {
        alumniName: params.firstName + " " + params.lastName,
        alumniID: params.id,
        nameOfInstitution: orgName,
        alumniSince: period,
        alumniCategory: params.alumniCategory,
        nameOfOrganization: orgName,
        nameOfAdmin: adminName,
        adminDesignation: adminDesignation,
        currentDateTime: currentDateTime,
        badgeID: badgeID,
        moreInfo: params.info,
      };
      const url =
        "https://generator-abfcaoddhq-bq.a.run.app/alumni-reference";
      const docName = "alumniReference.pdf";

      result = await getDocAndUpload(data, url, docName);
    }

    if (result) {
      // If id is provided, find and update the document
      if (params._id) {
        await MembershipReference.findByIdAndUpdate(
          params._id,
          {
            firstName: params.firstName,
            lastName: params.lastName,
            middleName: params.middleName,
            id: params.id,
            memberSince: params.memberSince,
            alumniCategory: params.alumniCategory,
            image: params.image,
            moreInfo: params.info,
            issued: true,
            dateIssued: new Date(),
            badgeUrl: result,
            badgeID: badgeID,
            issuingAdminDetails,
          },
          { new: true },
        );
        return true; // Return true if update is successful
      } else {
        // Create a new WorkReference document
        const membershipReference = new MembershipReference({
          orgId: orgId,
          firstName: params.firstName,
          lastName: params.lastName,
          middleName: params.middleName,
          alumniCategory: params.alumniCategory,
          id: params.id,
          memberSince: params.memberSince,
          image: params.image,
          moreInfo: params.info,
          issued: true,
          dateIssued: new Date(),
          badgeUrl: result,
          badgeID: badgeID,
          issuingAdminDetails,
        });

        // Save the WorkReference document to the database
        await membershipReference.save();
        return true; // Return true if creation is successful
      }
    } else return false;
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
  documentType: string;
  documentName: string;
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

    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const orgId = session.orgId;
    const adminDesignation = session.designation;
    const adminName = (session.firstName + " " + session.lastName) as string;
    const orgName = session.orgName as string;
    const currentDateTime = getCurrentDateTime();
    const badgeID = generateVeridaqID();
    const issuingAdminDetails = session.userId;

    console.log(params.id);

    const data = {
      nameOfOrganization: orgName,
      nameOfIndividual: params.firstName + " " + params.lastName,
      documentType: params.documentType,
      documentName: params.documentName,
      documentID: params.id,
      moreInfo: params.info,
      nameOfAdmin: adminName,
      adminDesignation: adminDesignation,
      currentDateTime: currentDateTime,
      badgeID: badgeID,
    };

    const url =
      "https://generator-abfcaoddhq-bq.a.run.app/doc-verification";
    const docName = "docVerification.pdf";

    const result = await getDocAndUpload(data, url, docName);

    if (result) {
      // If id is provided, find and update the document
      if (params._id) {
        await DocumentVerification.findByIdAndUpdate(
          params._id,
          {
            firstName: params.firstName,
            lastName: params.lastName,
            middleName: params.middleName,
            documentType: params.documentType, // Assuming id in MembershipParams corresponds to documentType
            documentName: params.documentName, // Assuming info in MembershipParams corresponds to documentName
            id: params.id,
            info: params.info,
            image: params.image, // Default to empty string if image is not provided
            issued: true,
            dateIssued: new Date(),
            badgeUrl: result,
            badgeID: badgeID,
            issuingAdminDetails: issuingAdminDetails,
          },
          { new: true },
        );
        return true; // Return true if update is successful
      } else {
        // If id is not provided, create a new document

        // Create a new WorkReference document
        const documentVerification = new DocumentVerification({
          orgId: orgId,
          firstName: params.firstName,
          lastName: params.lastName,
          middleName: params.middleName,
          documentType: params.documentType, // Assuming id in MembershipParams corresponds to documentType
          documentName: params.documentName, // Assuming info in MembershipParams corresponds to documentName
          id: params.id,
          info: params.info,
          image: params.image, // Default to empty string if image is not provided
          issued: true,
          dateIssued: new Date(),
          badgeUrl: result,
          badgeID: badgeID,
          issuingAdminDetails: issuingAdminDetails,
        });

        // Save the WorkReference document to the database
        await documentVerification.save();
        return true; // Return true if creation is successful
      }
    } else return false;
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
      DocDetails: `Work Reference Request from ${doc.firstName} ${doc.lastName}`,
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

export async function getHandsOnReference() {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the WorkReference collection based on orgId
    const workReferences = await HandsOnReference.find({
      orgId,
      issued: false,
    }).select("firstName lastName dateRequested");

    // Format the data before returning to the frontend
    const formattedData = workReferences.map((doc) => ({
      DocDetails: `Hands-On Experience Reference Request from ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      DocDate: formatDate(doc.dateRequested), // Format the date
    }));

    console.log(formattedData)

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch WorkReference documents");
  }
}

export async function getHandsOnReferenceById(docId: string) {
  try {
    // Connect to the database
    connectToDB();

    // Query the WorkReference collection based on the provided docId
    const workReference = await HandsOnReference.findById(docId);

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
      DocDetails: `Document Verification Reference Request from ${doc.firstName} ${doc.lastName}`,
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
      DocDetails: `Membership Reference Request from ${doc.firstName} ${doc.lastName}`,
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
      DocDetails: `Studentship Status Reference Request from ${doc.firstName} ${doc.lastName}`,
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

export async function getIssuedWorkReference() {
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
      issued: true,
    }).select("firstName lastName badgeUrl");

    // Format the data before returning to the frontend
    const formattedData = workReferences.map((doc) => ({
      heading: `Work Reference to ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      link: doc.badgeUrl,
      textColor: "#38313A",
      bgColor: "#F4DBE4",
      outlineColor: "#897A8B",
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch issued WorkReference documents");
  }
}

export async function getIssuedHandsOnReference() {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the WorkReference collection based on orgId
    const workReferences = await HandsOnReference.find({
      orgId,
      issued: true,
    }).select("firstName lastName badgeUrl");

    // Format the data before returning to the frontend
    const formattedData = workReferences.map((doc) => ({
      heading: `Work Reference to ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      link: doc.badgeUrl,
      textColor: "#38313A",
      bgColor: "#F4DBE4",
      outlineColor: "#897A8B",
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch issued WorkReference documents");
  }
}

export async function getIssuedMemberReference() {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the WorkReference collection based on orgId
    const memberReferences = await MembershipReference.find({
      orgId,
      issued: true,
    }).select("firstName lastName badgeUrl");

    // Format the data before returning to the frontend
    const formattedData = memberReferences.map((doc) => ({
      heading: `Member Reference to ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      link: doc.badgeUrl,
      textColor: "#FFFFFF",
      bgColor: "#38313A",
      outlineColor: "#C3B8D8",
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch issued memberReferences documents");
  }
}

export async function getIssuedStudentshipStatus() {
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
      issued: true,
    }).select("firstName lastName badgeUrl");

    // Format the data before returning to the frontend
    const formattedData = studentshipStatus.map((doc) => ({
      heading: `Studentship Status Reference to ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      link: doc.badgeUrl,
      textColor: "#38313A",
      bgColor: "#F26BBA",
      outlineColor: "#A593C5",
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch issued studentshipStatus documents");
  }
}

export async function getIssuedDocVerification() {
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
      issued: true,
    }).select("firstName lastName badgeUrl");

    // Format the data before returning to the frontend
    const formattedData = docVerification.map((doc) => ({
      heading: `Document Verification Reference to ${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(), // Convert _id to string
      link: doc.badgeUrl,
      textColor: "#38313A",
      bgColor: "#AF8BA4",
      outlineColor: "#F4DBE4",
    }));

    if (formattedData) return formattedData;
    false;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch issued studentshipStatus documents");
  }
}

export async function getTeamMembers() {
  try {
    const session = await getSession();

    if (!session || session.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Connect to the database
    connectToDB();

    const orgId = session.orgId;

    // Query the Role collection based on orgId
    const roles = await Role.find({
      organization: orgId,
    }).select("firstName lastName role designation");

    // Format the data before returning to the frontend
    const formattedData = roles.map((doc) => ({
      heading: `${doc.firstName} ${doc.lastName}`,
      DocId: doc._id.toString(),
      role: doc.designation,
      roles: doc.role,
    }));

    console.log(formattedData);

    return formattedData;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch team members");
  }
}

