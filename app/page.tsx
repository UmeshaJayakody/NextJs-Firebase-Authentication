"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '@/database/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (!userDoc.exists()) {
            // Retrieve user data from local storage
            const userData = localStorage.getItem('marketwave_registration_data');
            const {
              firstName = '',
              lastName = '',
            } = userData ? JSON.parse(userData) : {};
            // Create user document in Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
              firstName,
              lastName,
              email: user.email,
            });
            // Remove user data from local storage
            localStorage.removeItem('marketwave_registration_data');
          }
          setUser(user);
          router.push('/dashboard');
        } else {
          setUser(null);
          router.push('/login');
        }
      } else {
        setUser(null);
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? "Redirecting to dashboard..." : "Redirecting to login..."}
    </div>
  );
};

export default HomePage;