"use server";

import { BankDetailsInterface } from "@/components/form/settings/bankDetails";
import connectToDB from "../model/database";
import Organization from "../utils/organizationSchema";
import getSession from "./server-hooks/getsession.action";
import { SettingsProps } from "@/components/form/settings/settings";

export async function getBankDetails() {
    try {
        
        const session = await getSession()
        // Connect To Db
        connectToDB()

        const organizationBankDetails = await Organization.findById(session.orgId, {accountName: 1, accountNumber: 1, bankCode: 1, _id: 0})
        return organizationBankDetails;
    } catch (error) {
        console.error("Error querying DB for bank details", error);
        throw new Error("Error querying DB for bank details")
    }   
}

export async function getOrgDetails() {
    try {
        
        const session = await getSession()
        // Connect To Db
        connectToDB()

        const organizationDetails = await Organization.findById(
            session.orgId, 
            {
                name: 1,
                adminFirstName: 1, 
                adminLastName: 1,
                streetAddress: 1,  
                postalCode: 1, 
                city: 1,
                country: 1,
                image: 1,
                _id: 0
            })
        return organizationDetails;
    } catch (error) {
        console.error("Error querying DB for organization details", error);
        throw new Error("Error querying DB for organization details")
    }   
}

export async function updateBankDetails(params: BankDetailsInterface) {
    try {
        
        const session = await getSession()
        // Connect To Db
        connectToDB()

        await Organization.findByIdAndUpdate(
            session.orgId, 
            {
                accountName: params.accountName, 
                accountNumber: params.accountNumber, 
                bankCode: params.bankCode, 
            }
        )
        return true;
    } catch (error) {
        console.error("Error querying DB for bank details", error);
        throw new Error("Error querying DB for bank details");
    }   
}


export async function updateOrgDetails(params: SettingsProps) {
    try {
        
        const session = await getSession()
        
        // Connect To Db
        connectToDB()

        const organizationDetails = await Organization.findByIdAndUpdate(
            session.orgId, 
            {
                name: params.orgName,
                adminFirstName: params.adminFirstName, 
                adminLastName: params.adminLastName,
                streetAddress: params.streetAddress,  
                postalCode: params.postalCode, 
                city: params.city,
                country: params.country,
                image: params.image,
            })
        return organizationDetails;
    } catch (error) {
        console.error("Error querying DB for organization details", error);
        throw new Error("Error querying DB for organization details")
    }   
}