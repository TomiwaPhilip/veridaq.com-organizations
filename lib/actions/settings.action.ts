"use server";

import { BankDetailsInterface } from "@/components/form/settings/bankDetails";
import connectToDB from "../model/database";
import Organization from "../utils/organizationSchema";
import getSession from "./server-hooks/getsession.action";
import { SettingsProps } from "@/components/form/settings/settings";
import { RequestPriceInterface } from "@/components/form/settings/requestPrice";
import Role from "../utils/roleSchema";
import { sendTeamInvite } from "../utils";

export async function getBankDetails() {
  try {
    const session = await getSession();
    
    // Check if session or session.orgId is null
    if (!session || !session.orgId) {
      throw new Error("Unable to get session or orgId");
    }

    // Connect To Db
    connectToDB();

    const organizationBankDetails = await Organization.findById(session.orgId, {
      accountName: 1,
      accountNumber: 1,
      bankCode: 1,
      _id: 0,
    });

    // Check if organizationBankDetails is null
    if (!organizationBankDetails) {
      return null;
    }

    // Convert fields to strings
    const bankDetailsStringified = {
      accountName: organizationBankDetails.accountName?.toString() ?? '',
      accountNumber: organizationBankDetails.accountNumber?.toString() ?? '',
      bankCode: organizationBankDetails.bankCode?.toString() ?? '',
    };

    console.log(bankDetailsStringified);

    return bankDetailsStringified;
  } catch (error) {
    console.error("Error querying DB for bank details", error);
    throw new Error("Error querying DB for bank details");
  }
}

export async function getOrgDetails() {
  try {
    const session = await getSession();
    
    // Check if session or session.orgId is null
    if (!session || !session.orgId) {
      throw new Error("Unable to get session or orgId");
    }

    // Connect To Db
    connectToDB();

    const organizationDetails = await Organization.findById(session.orgId, {
      name: 1,
      adminFirstName: 1,
      adminLastName: 1,
      streetAddress: 1,
      postalCode: 1,
      city: 1,
      country: 1,
      image: 1,
      studentStatusFee: 1,
      docVerificationFee: 1,
      membershipRefFee: 1,
      _id: 0,
    });

    // Check if organizationDetails is null
    if (!organizationDetails) {
      return null;
    }

    // Convert fields to strings
    const orgDetailsStringified = {
      name: organizationDetails.name?.toString() ?? '',
      adminFirstName: organizationDetails.adminFirstName?.toString() ?? '',
      adminLastName: organizationDetails.adminLastName?.toString() ?? '',
      streetAddress: organizationDetails.streetAddress?.toString() ?? '',
      postalCode: organizationDetails.postalCode?.toString() ?? '',
      city: organizationDetails.city?.toString() ?? '',
      country: organizationDetails.country?.toString() ?? '',
      image: organizationDetails.image?.toString() ?? '',
      studentStatusFee: organizationDetails.studentStatusFee ?? 0,
      docVerificationFee: organizationDetails.docVerificationFee ?? 0,
      membershipRefFee: organizationDetails.membershipRefFee ?? 0,
    };

    console.log(orgDetailsStringified);

    return orgDetailsStringified;
  } catch (error) {
    console.error("Error querying DB for organization details", error);
    throw new Error("Error querying DB for organization details");
  }
}


export async function updateBankDetails(params: BankDetailsInterface) {
  try {
    const session = await getSession();
    // Connect To Db
    connectToDB();

    await Organization.findByIdAndUpdate(session.orgId, {
      accountName: params.accountName,
      accountNumber: params.accountNumber,
      bankCode: params.bankCode,
    });
    return true;
  } catch (error) {
    console.error("Error updating bank details in DB", error);
    throw new Error("Error updating bank details in DB");
  }
}

interface RoleInterface {
  firstName: string;
  lastName: string;
  designation: string;
  role: string;
  email: string;
}
export async function updateOrgRole(params: RoleInterface) {
  try {
    const session = await getSession();
    // Connect To Db
    connectToDB();

    const role = new Role({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      designation: params.designation,
      role: params.role,
      organization: session.orgId,
    });

    await role.save();

    const data = await sendTeamInvite({
      firstName: params.firstName,
      email: params.email,
      organizationName: session.orgName as string,
    });
    if (data) {
      return true;
    } else return false;
  } catch (error) {
    console.error("Error role details in DB", error);
    throw new Error("Error role details in DB");
  }
}

export async function updateOrgDetails(params: SettingsProps) {
  try {
    const session = await getSession();

    // Connect To Db
    connectToDB();

    await Organization.findByIdAndUpdate(session.orgId, {
      name: params.orgName,
      adminFirstName: params.adminFirstName,
      adminLastName: params.adminLastName,
      streetAddress: params.streetAddress,
      postalCode: params.postalCode,
      city: params.city,
      country: params.country,
      image: params.image,
    });
    return true;
  } catch (error) {
    console.error("Error updating organization details in DB", error);
    throw new Error("Error updating organization details in DB");
  }
}

export async function updatePricingDetails(params: RequestPriceInterface) {
  try {
    const session = await getSession();
    // Connect To Db
    connectToDB();

    await Organization.findByIdAndUpdate(session.orgId, {
      studentStatusFee: params.studentStatusFee,
      docVerificationFee: params.docVerificationFee,
      membershipRefFee: params.membershipRefFee,
    });
    return true;
  } catch (error) {
    console.error("Error updating request pricing in DB", error);
    throw new Error("Error updating request pricing in DB");
  }
}
