"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/database/firebase/firebase";

const PasswordChange = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Check your email for password reset instructions.");
            setEmail('');
        } catch (err: any) {
            setError(err.message || "An unknown error occurred. Please try again later.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <form className="flex flex-col w-1/2" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="border p-2 my-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="bg-blue-500 text-white p-2 rounded my-2" type="submit">Reset Password</button>
            </form>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default PasswordChange;