"use client";

import { useState } from 'react';
import { RiLoader4Line } from 'react-icons/ri';
import { useSearchParams } from 'next/navigation'
import { verifyUserToken } from '@/lib/actions/login.action';
import { NoOutlineButtonBig } from '@/components/shared/buttons';

export default function Verify() {
    const searchParams = useSearchParams()
    const [verifyResult, setVerifyResult] = useState('Click the below button to verify your email');
    const [loading, setLoading] = useState(false); // Set loading to false initially

    const token = searchParams.get('token') as string;
    console.log(token)
    const handleVerify = async () => {
        try {
            setLoading(true); // Set loading to true before verification
            const result = await verifyUserToken(token);
            if (result) {
                setVerifyResult('You\'re verified');
                // Redirect to home page if verified
                window.location.href = '/';
            } else {
                setVerifyResult('Invalid verification credentials');
                // Redirect to sign-in page if not verified
                window.location.href = '/auth/signin';
            }
        } catch (error: any) {
            console.error('Error verifying token:', error.message);
            setVerifyResult('Error verifying token');
        } finally {
            setLoading(false); // Set loading to false after verification
        }
    };

    return (
        <main className='text-white flex flex-col items-center justify-center h-screen'>
            {loading ? (
                <RiLoader4Line className="animate-spin text-2xl mb-4" />
            ) : (
                <p className='text-center text-xl font-bold'>{verifyResult}</p>
            )}
            <span onClick={handleVerify}>
                <NoOutlineButtonBig
                    type='button'
                    name='Verify Me'
                    disabled={loading}
                />
            </span>
        </main>
    );
}
