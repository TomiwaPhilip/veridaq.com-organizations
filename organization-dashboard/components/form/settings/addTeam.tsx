"use client";

import React, { useState, useEffect } from "react";
import { RiLoader4Line } from "react-icons/ri";

import { BlackButton } from "@/components/shared/buttons";
import { Card4, useSession } from "@/components/shared/shared";
import { getTeamMembers } from "@/lib/actions/request.action";
import ModalForm from "./modalForm";

export default function AddTeam() {
  interface Documents {
    DocId: string;
    heading: string;
    role: any;
    roles: any;
  }

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [teamMembersDoc, setTeamMembersDoc] = useState<Documents[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  useEffect(() => {
    console.log("Fetchig teams");
    const fetchData = async () => {
      try {
        const doc1 = await getTeamMembers();
        console.log(doc1);
        if (doc1) setTeamMembersDoc(doc1);
        console.log(teamMembersDoc);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchData();
  }, []);

  let isAdmin;

  if (session?.role === "admin") isAdmin = true;

  return (
    <>
      <div className="text-[#38313A]">
        <div className="mt-[50px]">
          <p className="text-2xl font-bold mb-5">
            Admin & Organization Members Settings
          </p>
          <div className="">
            {isAdmin && (
              <>
                {!isLoading ? (
                  teamMembersDoc.length > 0 ? (
                    teamMembersDoc.map((doc: Documents) => (
                      <Card4
                        key={doc.DocId}
                        heading={doc.heading}
                        textColor={
                          doc.roles === "admin"
                            ? "#000000"
                            : doc.roles === "workRefVeridaqRole"
                              ? "#694C9F"
                              : doc.roles === "memStatusVeridaqRole"
                                ? "#A593C5"
                                : doc.roles === "docRefVeridaqRole"
                                  ? "#FACEE8"
                                  : doc.roles === "stdStatusVeridaqRole"
                                    ? "#554957"
                                    : "#554957"
                        }
                        bgColor={
                          doc.roles === "admin"
                            ? "#F4DBE4"
                            : doc.roles === "workRefVeridaqRole"
                              ? "#F4DBE4"
                              : doc.roles === "memStatusVeridaqRole"
                                ? "#38313A"
                                : doc.roles === "docRefVeridaqRole"
                                  ? "#F26BBA"
                                  : doc.roles === "stdStatusVeridaqRole"
                                    ? "#554957"
                                    : "#554957"
                        }
                        outlineColor={
                          doc.roles === "admin"
                            ? "#694C9F"
                            : doc.roles === "workRefVeridaqRole"
                              ? "#694C9F"
                              : doc.roles === "memStatusVeridaqRole"
                                ? "#A593C5"
                                : doc.roles === "docRefVeridaqRole"
                                  ? "#FACEE8"
                                  : doc.roles === "stdStatusVeridaqRole"
                                    ? "#554957"
                                    : "#554957"
                        }
                        rights={
                          doc.roles === "admin"
                            ? "Has rights to everything on Veridaq"
                            : doc.roles === "workRefVeridaqRole"
                              ? "Has rights to Work Reference Veridaq"
                              : doc.roles === "memStatusVeridaqRole"
                                ? "Has rights to Membership Reference Veridaq"
                                : doc.roles === "docRefVeridaqRole"
                                  ? "Has rights to Document Verification Veridaq"
                                  : doc.roles === "stdStatusVeridaqRole"
                                    ? "Has rights to Studentship Status Veridaq"
                                    : "#554957"
                        }
                        role={doc.role}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <RiLoader4Line className="animate-spin text-2xl mb-4" />
                    </div>
                  )
                ) : null}
              </>
            )}

            <div className="">
              <BlackButton
                type="submit"
                name="Add Team Members"
                onClick={handleOpenModal}
              />
            </div>
          </div>
        </div>
      </div>
      {openModal && <ModalForm onClose={handleCloseModal} />}
    </>
  );
}
