"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '@/database/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user.emailVerified) {
                // Retrieve user data from local storage
                const registration_data = localStorage.getItem('marketwave_registration_data');
                const {
                    firstName = '',
                    lastName = ''
                } = registration_data ? JSON.parse(registration_data) : {};

                // Check if user exists in Firestore
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (!userDoc.exists()) {
                    await setDoc(doc(firestore, 'users', user.uid), {
                        firstName,
                        lastName,
                        email: user.email
                    });
                }
                router.push('/dashboard');
            } else {
                setError('Please verify your email address to continue.');
            }
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
            <h2 className="text-3xl font-bold">Login</h2>
            <form className="flex flex-col w-1/2" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 my-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 my-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-500 text-white p-2 rounded my-2" type="submit">Login</button>
                {error && <p className="text-red-500">{error}</p>}
                <Link href="/register" className="text-blue-500">
                    Create an account
                </Link>
            </form>
        </div>
    );
};

export default Login;