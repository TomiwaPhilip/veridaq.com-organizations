"use server";

import got from "got";
import getSession from "./server-hooks/getsession.action";
import Organization from "../utils/organizationSchema";
import connectToDB from "../model/database";

function generateRandomString(length: any) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `AHLR22LU_${result}`;
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
        response = await got.post('https://api-d.squadco.com/payout/account/lookup', {
            headers: {
                Authorization: "Bearer sk_2c7f4b78988dab6be5667fb11a091a24e09b4bc6",
            },
            json: {
                bank_code: bankCode,
                account_number: accountNumber,
            },
        }).json();
        console.log(response)

        if (response.status !== 200 || response.data.account_name !== orgBankDetails.accountName) {
            throw new Error("Invalid bank account details");
        }

        const transactionResponse: any = await got.post('https://api-d.squadco.com/payout/transfer', {
            headers: {
                Authorization: "Bearer sk_bffcefd1f820a26fcf3d8a5e5d7976cb1b46d80d",
            },
            json: {
                remark: "for test transfer to my customer",
                bank_code: orgBankDetails.bankCode,
                currency_id: "NGN",
                amount: session.walletBalance,
                account_number: orgBankDetails.accountNumber,
                transaction_reference: transaction_ref,
                account_name: orgBankDetails.accountName,
            },
        }).json();

        if (transactionResponse.status === 200) {
            session.walletBalance = "0.00";
            await session.save();

            // Update organization balance
            const org = await Organization.findByIdAndUpdate(session.orgId, { walletBalance: session.walletBalance });
            console.log(org);
            return true;
        } else if (transactionResponse.status === 424) {
            // Requery transaction
            const transactionQuery: any = await got.post('https://api-d.squadco.com/payout/requery', {
                headers: {
                    Authorization: "Bearer sk_bffcefd1f820a26fcf3d8a5e5d7976cb1b46d80d",
                },
                json: {
                    transaction_reference: transaction_ref,
                },
            }).json();

            if (transactionQuery.status === 200) {
                session.walletBalance = "0.00";
                await session.save();

                // Update organization balance
                const org = await Organization.findByIdAndUpdate(session.orgId, { walletBalance: session.walletBalance });
                console.log(org);

                return true;
            } else {
                throw new Error("Unable to make payments");
            }
        } else {
            throw new Error("Unable to make payments");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}


