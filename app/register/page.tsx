"use client";
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, firestore } from '@/database/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleRegister = async (event: FormEvent) => {
        // Prevent default form submission
        event.preventDefault();
        setError(null);
        setMessage(null);
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Send email verification
            await sendEmailVerification(user);
            // Temporarily store user data in local storage
            localStorage.setItem(
                'marketwave_registration_data',
                JSON.stringify({
                    firstName,
                    lastName,
                    email
                })
            );
            setMessage('Registration successful. Please check your email to verify your account.');

            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred. Please try again later.');
            }
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-3xl font-bold">Register</h2>
            <form className="flex flex-col w-1/2" onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    className="p-2 my-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="p-2 my-2 border border-gray-300 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="p-2 my-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="p-2 my-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="p-2 my-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="p-2 my-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
        </div>
    );
}

export default Register;