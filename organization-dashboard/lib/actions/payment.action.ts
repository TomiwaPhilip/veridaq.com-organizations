"use server";

const Flutterwave = require("flutterwave-node-v3");

import getSession from "./server-hooks/getsession.action";
import Organization from "../utils/organizationSchema";
import connectToDB from "../model/database";

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
        let response: any;

        console.log(orgBankDetails)

        // First lookup account
        const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
        const details = {
          account_number: "0690000031",
          account_bank: "044",
        };
        response = await flw.Misc.verify_Account(details)

        console.log(response);

        if (response.status === "error") return false;

        const transferDetails = {
            account_bank: bankCode,
            account_number: accountNumber,
            amount: 200, // session.walletBalance,
            currency: "NGN",
            narration: "Payment for things",
            reference: transaction_ref,
        };

        console.log("Initiating transfer...")
        const transactionResponse: any = await flw.Transfer.initiate(transferDetails)
        console.log(transactionResponse);

        if (transactionResponse.status === "success") {

            // Transaction status is successful and ongoing, now wait for 2 mins and confirm transaction
            await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));
            
            const response = await flw.Transfer.get_a_transfer({id: transactionResponse.data.id});

            if (response.data.status === "SUCCESSFUL") {

                // Transaction is successful empty wallet balance in DB and session
                session.walletBalance = "0.00";
                await session.save();
    
                // Update organization balance
                const org = await Organization.findByIdAndUpdate(session.orgId, { walletBalance: session.walletBalance });
                console.log(org);
                return true;
            } else if (response.data.status === "FAILED") return false;

        } else if (transactionResponse.status === "error") {
            // Return false for failed transaction initiation
            return false;
        } else {
            throw new Error("Unable to make payments");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}


