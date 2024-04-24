import { getBankDetails, getOrgDetails } from "@/lib/actions/settings.action";
import BankDetails, { BankDetailsInterface } from "../form/settings/bankDetails";
import Settings from "../form/settings/settings";
import RequestPrice from "../form/settings/requestPrice";

export default async function SettingsPage() {

    const bankDetailsfromDB: BankDetailsInterface = await getBankDetails();
    const orgDetaisfromDB = await getOrgDetails();

    return (
        <>
            <Settings 
                    orgName= {orgDetaisfromDB.name}
                    adminFirstName= {orgDetaisfromDB.adminFirstName}
                    adminLastName= {orgDetaisfromDB.adminLastName}
                    streetAddress= {orgDetaisfromDB.streetAddress}
                    postalCode= {orgDetaisfromDB.postalCode}
                    city= {orgDetaisfromDB.city}
                    country= {orgDetaisfromDB.country}
                    image= {orgDetaisfromDB.image}
            />
            <BankDetails 
                accountName={bankDetailsfromDB.accountName} 
                accountNumber={bankDetailsfromDB.accountNumber} 
                bankCode={bankDetailsfromDB.bankCode} 
            />
            <RequestPrice
                studentStatusFee={orgDetaisfromDB.studentStatusFee}
                docVerificationFee={orgDetaisfromDB.docVerificationFee}
                membershipRefFee={orgDetaisfromDB.membershipRefFee}
            />
        </>
    )
}