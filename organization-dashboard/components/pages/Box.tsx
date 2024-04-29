"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { RiLoader4Line } from "react-icons/ri";

import ModalWithStepper from "@/components/shared/Modal";
import {
  SearchBar2,
  VeridaqDocument,
  useSession,
} from "@/components/shared/shared";
import {
  getWorkReference,
  getDocVerification,
  getMemberReference,
  getStudentshipStatus,
} from "@/lib/actions/request.action";

export default function Box() {
  interface Documents {
    DocDetails: string;
    DocId: string;
    DocDate: string;
  }

  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [openModalDocId, setOpenModalDocId] = useState<string | null>(null);
  const [workReferenceDoc, setWorkReferenceDoc] = useState<Documents[]>([]);
  const [memberReferenceDoc, setMemberReferenceDoc] = useState<Documents[]>([]);
  const [docVerificationDoc, setDocVerificationDoc] = useState<Documents[]>([]);
  const [studentStatusDoc, setStudentStatusDoc] = useState<Documents[]>([]);
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc1 = await getWorkReference();
        if (doc1) setWorkReferenceDoc(doc1);
        console.log(workReferenceDoc);

        const doc2 = await getMemberReference();
        if (doc2) setMemberReferenceDoc(doc2);

        const doc3 = await getDocVerification();
        if (doc3) setDocVerificationDoc(doc3);

        const doc4 = await getStudentshipStatus();
        if (doc4) setStudentStatusDoc(doc4);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (id: string, docId: string) => {
    setOpenModalId(id);
    setOpenModalDocId(docId);
  };

  const handleCloseModal = () => {
    setOpenModalId(null);
  };

  let isAdmin;
  let workRefVeridaqRole: boolean = false;
  let memStatusVeridaqRole: boolean = false;
  let docRefVeridaqRole: boolean = false;
  let stdStatusVeridaqRole: boolean = false;

  if (session?.role === "admin") isAdmin = true;
  if (session?.role === "workRefVeridaqRole") isAdmin = true;
  if (session?.role === "memStatusVeridaqRole") isAdmin = true;
  if (session?.role === "docRefVeridaqRole") docRefVeridaqRole = true;
  if (session?.role === "stdStatusVeridaqRole") stdStatusVeridaqRole = true;

  return (
    <main className="mt-[30px]">
      <div className="mb-[40px]">
        <p className="font-semibold text-[28px] text-[#38313A]">
          Pending Issuance
        </p>
        <p className="text-sm text-[#38313A]">
          Pending Veridaq Issuance from Veridaq Request to your Organization
        </p>
        <div className="mt-10">
          <div className="flex-1">
            <div className="p-7 bg-[#C3B8D8] rounded-lg h-full">
              <div className="">
                <SearchBar2 />
              </div>
              <div className="mt-10 overflow-auto">
                {!isLoading ? (
                  <>
                    {isAdmin &&
                    (workReferenceDoc.length > 0 ||
                      memberReferenceDoc.length > 0 ||
                      docVerificationDoc.length > 0 ||
                      studentStatusDoc.length > 0) ? (
                      <>
                        {workReferenceDoc.map((doc: Documents) => (
                          <VeridaqDocument
                            key={doc.DocId}
                            DocDetails={doc.DocDetails}
                            DocDate={doc.DocDate}
                            docId={doc.DocId}
                            id="1"
                            onClick={handleOpenModal}
                          />
                        ))}
                        {memberReferenceDoc.map((doc: Documents) => (
                          <VeridaqDocument
                            key={doc.DocId}
                            DocDetails={doc.DocDetails}
                            DocDate={doc.DocDate}
                            docId={doc.DocId}
                            id="3"
                            onClick={handleOpenModal}
                          />
                        ))}
                        {docVerificationDoc.map((doc: Documents) => (
                          <VeridaqDocument
                            key={doc.DocId}
                            DocDetails={doc.DocDetails}
                            DocDate={doc.DocDate}
                            docId={doc.DocId}
                            id="4"
                            onClick={handleOpenModal}
                          />
                        ))}
                        {studentStatusDoc.map((doc: Documents) => (
                          <VeridaqDocument
                            key={doc.DocId}
                            DocDetails={doc.DocDetails}
                            DocDate={doc.DocDate}
                            docId={doc.DocId}
                            id="2"
                            onClick={handleOpenModal}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Image
                          src="/assets/images/error.png"
                          alt="No Document Found"
                          width={200}
                          height={200}
                        />
                        <p className="text-center mt-2">
                          You have no Documents yet!
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <RiLoader4Line className="animate-spin text-2xl mb-4" />
                    <p className="font-bold">Loading...</p>
                  </div>
                )}

                {!isAdmin && workRefVeridaqRole && (
                  <>
                    {!isLoading ? (
                      <>
                        {workReferenceDoc.length > 0 ? (
                          workReferenceDoc.map((doc: Documents) => (
                            <VeridaqDocument
                              key={doc.DocId}
                              DocDetails={doc.DocDetails}
                              DocDate={doc.DocDate}
                              docId={doc.DocId}
                              id="1"
                              onClick={handleOpenModal}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Image
                              src="/assets/images/error.png"
                              alt="Not Found"
                              width={200}
                              height={200}
                            />
                            <p className="text-center mt-2">
                              No documents found!
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <RiLoader4Line className="animate-spin text-2xl mb-4" />
                        <p>Loading...</p>
                      </div>
                    )}
                  </>
                )}

                {!isAdmin && memStatusVeridaqRole && (
                  <>
                    {!isLoading ? (
                      <>
                        {memberReferenceDoc.length > 0 ? (
                          memberReferenceDoc.map((doc: Documents) => (
                            <VeridaqDocument
                              key={doc.DocId}
                              DocDetails={doc.DocDetails}
                              DocDate={doc.DocDate}
                              docId={doc.DocId}
                              id="3"
                              onClick={handleOpenModal}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Image
                              src="/assets/images/error.png"
                              alt="Not Found"
                              width={200}
                              height={200}
                            />
                            <p className="text-center mt-2">
                              No documents found!
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <RiLoader4Line className="animate-spin text-2xl mb-4" />
                        <p>Loading...</p>
                      </div>
                    )}
                  </>
                )}

                {!isAdmin && docRefVeridaqRole && (
                  <>
                    {!isLoading ? (
                      <>
                        {docVerificationDoc.length > 0 ? (
                          docVerificationDoc.map((doc: Documents) => (
                            <VeridaqDocument
                              key={doc.DocId}
                              DocDetails={doc.DocDetails}
                              DocDate={doc.DocDate}
                              docId={doc.DocId}
                              id="4"
                              onClick={handleOpenModal}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Image
                              src="/assets/images/error.png"
                              alt="Not Found"
                              width={200}
                              height={200}
                            />
                            <p className="text-center mt-2">
                              No documents found!
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <RiLoader4Line className="animate-spin text-2xl mb-4" />
                        <p>Loading...</p>
                      </div>
                    )}
                  </>
                )}

                {!isAdmin && stdStatusVeridaqRole && (
                  <>
                    {!isLoading ? (
                      <>
                        {studentStatusDoc.length > 0 ? (
                          studentStatusDoc.map((doc: Documents) => (
                            <VeridaqDocument
                              key={doc.DocId}
                              DocDetails={doc.DocDetails}
                              DocDate={doc.DocDate}
                              docId={doc.DocId}
                              id="2"
                              onClick={handleOpenModal}
                            />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Image
                              src="/assets/images/error.png"
                              alt="Not Found"
                              width={200}
                              height={200}
                            />
                            <p className="text-center mt-2">
                              No documents found!
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <RiLoader4Line className="animate-spin text-2xl mb-4" />
                        <p>Loading...</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* TO DO Implement endless scrolling or pagination. */}
      {openModalId && (
        <ModalWithStepper
          id={openModalId}
          onClose={handleCloseModal}
          docId={openModalDocId}
        />
      )}
    </main>
  );
}
