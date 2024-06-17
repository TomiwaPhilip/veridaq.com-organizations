"use client";

import { useEffect, useState } from 'react';
import { getBankDetails, getOrgDetails } from "@/lib/actions/settings.action";
import BankDetails, { BankDetailsInterface } from "../form/settings/bankDetails";
import Settings from "../form/settings/settings";
import RequestPrice from "../form/settings/requestPrice";
import AddTeam from "../form/settings/addTeam";

interface OrgDetails {
  name: string;
  adminFirstName: string;
  adminLastName: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  image: string;
  studentStatusFee: number;
  docVerificationFee: number;
  membershipRefFee: number;
}

export default function SettingsPage() {
  const [orgDetails, setOrgDetails] = useState<OrgDetails | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetailsInterface | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bankDetailsData = await getBankDetails();
        const orgDetailsData = await getOrgDetails();
        setBankDetails(bankDetailsData);
        setOrgDetails(orgDetailsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {orgDetails && (
        <Settings
          orgName={orgDetails.name ?? null}
          adminFirstName={orgDetails.adminFirstName ?? null}
          adminLastName={orgDetails.adminLastName ?? null}
          streetAddress={orgDetails.streetAddress ?? null}
          postalCode={orgDetails.postalCode ?? null}
          city={orgDetails.city ?? null}
          country={orgDetails.country ?? null}
          image={orgDetails.image ?? null}
        />
      )}
      {bankDetails && (
        <BankDetails
          accountName={bankDetails.accountName ?? null}
          accountNumber={bankDetails.accountNumber ?? null}
          bankCode={bankDetails.bankCode ?? null}
        />
      )}
      {orgDetails && (
        <RequestPrice
          studentStatusFee={orgDetails.studentStatusFee ?? null}
          docVerificationFee={orgDetails.docVerificationFee ?? null}
          membershipRefFee={orgDetails.membershipRefFee ?? null}
        />
      )}
      <AddTeam />
    </>
  );
}
