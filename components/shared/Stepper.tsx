"use client";

import React from "react";
import WorkReference from "../form/workReference/workReference";
import StudentshipStatus from "../form/studentshipstatus/studentshipStatus";
import MembershipReference from "../form/membershipReference/membershipReference";
import DocumentVerification from "../form/documentVerification/documentVerification";
import HandsOnReference from "../form/handsOnReference/handsOnReference";

interface StepperFormProps {
  id: string;
  docId?: string | null;
}

const StepperForm: React.FC<StepperFormProps> = ({ id, docId }) => {
  let content;
  let title;

  switch (id) {
    case "1":
      content = <WorkReference docId={docId} />;
      title = "Issue Work Reference Veridaq"; // Change the title based on the id
      break;
    case "2":
      content = <StudentshipStatus docId={docId} />;
      title = "Issue Studentship Status Veridaq"; // Change the title based on the id
      break;
    case "3":
      content = <MembershipReference docId={docId} />;
      title = "Issue Membership Reference Veridaq"; // Change the title based on the id
      break;
    case "4":
      content = <DocumentVerification docId={docId} />;
      title = "Issue Document Verification Veridaq"; // Change the title based on the id
      break;
    case "5":
      content = <HandsOnReference docId={docId} />;
      title = "Issue Hands-On Experience Reference Veridaq"; // Change the title based on the id
      break;
    // Include cases for other card ids if needed
    default:
      content = null;
      title = "Modal Stepper Form";
  }

  return (
    <div>
      <h2 className="font-semibold text-[24px] px-8 pt-8">{title}</h2>
      {content}
    </div>
  );
};

export default StepperForm;
