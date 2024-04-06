"use server";

import getSession from "./server-hooks/getsession.action";
import connectToDB from "../model/database";
import Organization from "../utils/organizationSchema";
import Role from "../utils/roleSchema";

interface Params {
    orgName: string;
    adminFirstName: string;
    adminLastName: string;
    streetAddress: string;
    city: string;
    postalCode: string,
    country: string;
    image: string;
}

export async function updateUser(params: Params) {
    try {
        const session = await getSession();

        if (!session) {
            throw new Error("Unauthorized");
        }

        const orgId = session.orgId;
        const userId = session.userId;

        console.log(params.streetAddress)

        // Connect to the database
        connectToDB();

        // Update the organization in the database
        await Organization.findOneAndUpdate(
            { _id: orgId },
            {
                name: params.orgName,
                adminFirstName: params.adminFirstName,
                adminLastName: params.adminLastName,
                streetAddress: params.streetAddress,
                city: params.city,
                postalCode: params.postalCode,
                country: params.country,
                image: params.image,
                onboarded: true
            },
            // Upsert means both updating and inserting
            { upsert: true }
        );

        // Update the user in the database
        await Role.findByIdAndUpdate(
            userId,
            { firstName: params.adminFirstName, lastName: params.adminLastName },
            {upsert: true}
        );

        session.isOnboarded = true;
        session.image = params.image;
        await session.save();
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}
