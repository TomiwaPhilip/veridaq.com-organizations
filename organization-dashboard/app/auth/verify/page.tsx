"use client";
import { useSearchParams } from 'next/navigation'
import { useState } from 'react';
import { verifyUserToken } from '@/lib/actions/login.action';


export default function Verify() {
    const searchParams = useSearchParams()
    const [verifyResult, setVerifyResult] = useState('Waiting for Verification')
 
    const token = searchParams.get('token') as string;
    console.log(token)
    async function verifyUser() {
        const result = await verifyUserToken(token)
        if (result) {
            setVerifyResult('Youre verified')
        } else {
            setVerifyResult('Error unauthorized bullsshit')
        }
    }
    return (
        <>
        <div> This is the Verification page </div>
        <p>{verifyResult}</p>
        <button type='submit' onClick={verifyUser}>Verify Me</button>
        </>
    );
}

