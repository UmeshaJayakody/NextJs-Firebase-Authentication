"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firestore } from '@/database/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userNames, setUserNames] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserNames(`${data.firstName} ${data.lastName}`);
                }
            } else {
                router.push('/login');
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangePassword = async () => {
        router.push('/change-password');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <div className="flex flex-col w-1/2">
                <p>Welcome, {userNames}</p>
                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleChangePassword}>Change Password</button>
            </div>
        </div>
    );
};

export default Dashboard;