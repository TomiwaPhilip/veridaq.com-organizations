"use server";

import getSession from "./server-hooks/getsession.action";
import Organization from "../utils/organizationSchema";
import connectToDB from "../model/database";
import got from "got";

function generateRandomString(length: any) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `${result}_PMCKDU_1`;
}

export async function withDrawFunds() {
    try {
        // Connect Db
        connectToDB();

        const session = await getSession();

        const orgBankDetails = await Organization.findById(session.orgId, { accountName: 1, accountNumber: 1, bankCode: 1 });
        const bankCode = orgBankDetails.bankCode.toString();
        const accountNumber = orgBankDetails.accountNumber.toString();
        const transaction_ref = generateRandomString(8);

        console.log(orgBankDetails)

        console.log("Initiating transfer...")

        const response: any = await got.post('https://sandboxapi.fincra.com/disbursements/payouts',
            {
                headers: {
                    'api-key': `${process.env.FINCRA_SECRET_KEY}`,
                    'x-pub-key': `${process.env.FINCRA_PUBLIC_KEY}`,
                    'x-business-id': `${process.env.FINCRA_BUSINESS_ID}`,
                },
                json: {
                    "amount": 5070,
                    "beneficiary": {
                        "accountHolderName": "Customer Name",
                        "accountNumber": accountNumber,
                        "bankCode": bankCode,
                        // "country": "NG",
                        "firstName": session.firstName,
                        "lastName": session.lastName,
                        "type": "individual"
                    },
                    "business": "6673cfe24d51d933b0a42068",
                    "customerReference": transaction_ref,
                    "description": "Test",
                    "destinationCurrency": "NGN",
                    "paymentDestination": "bank_account",
                    "sourceCurrency": "NGN",
                }
            }
        ).json()

        console.log(response.body);

        // if (transactionResponse.status === "success") {

        //     // Transaction status is successful and ongoing, now wait for 2 mins and confirm transaction
        //     await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

        //     const response = await flw.Transfer.get_a_transfer({ id: transactionResponse.data.id });

        //     if (response.data.status === "SUCCESSFUL") {

        //         // Transaction is successful empty wallet balance in DB and session
        //         session.walletBalance = "0.00";
        //         await session.save();

        //         // Update organization balance
        //         const org = await Organization.findByIdAndUpdate(session.orgId, { walletBalance: session.walletBalance });
        //         console.log(org);
        //         return true;
        //     } else if (response.data.status === "FAILED") return false;

        // } else if (transactionResponse.status === "error") {
        //     // Return false for failed transaction initiation
        //     return false;
        // } else {
        //     throw new Error("Unable to make payments");
        // }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}


