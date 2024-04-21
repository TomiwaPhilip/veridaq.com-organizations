import { getBankDetails, getOrgDetails } from "@/lib/actions/settings.action";
import BankDetails, { BankDetailsInterface } from "../form/settings/bankDetails";
import Settings, { SettingsProps } from "../form/settings/settings";

export default async function SettingsPage() {

    const bankDetailsfromDB: BankDetailsInterface = await getBankDetails();
    const orgDetaisfromDB: SettingsProps = await getOrgDetails();

    return (
        <>
            <Settings 
                    orgName= {orgDetaisfromDB.orgName}
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
        </>
    )
}