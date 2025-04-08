// register.api.ts

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../../config/firebaseConfig';

export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bio?: string;
  role: string;
}) => {
  const { email, password, firstName, lastName,dob, gender, bio,role } = userData;

  // Create user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;


// Format dob to prevent Firestore from parsing it as a Timestamp
const dobDate = new Date(dob);
const day = String(dobDate.getDate()).padStart(2, '0');
const month = String(dobDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const year = dobDate.getFullYear();

// Use a non-ISO format
const formattedDob = `${day}/${month}/${year}`; 


  // Store additional user data in Firestore
  const db = getFirestore(); // Get Firestore instance
  await setDoc(doc(db, 'users', user.uid), {
    Id: user.uid,
    Email: user.email,
    FirstName: firstName,
    LastName: lastName,
    DOB: formattedDob,
    Gender: gender,
    Bio: bio || '',
    CreatedAt: Timestamp.now(),
    Role: role,
  });

  return user;
};
