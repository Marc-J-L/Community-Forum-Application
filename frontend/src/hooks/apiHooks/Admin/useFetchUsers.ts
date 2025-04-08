import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { UserInfoDTO } from '../../../types/user.type'; // Adjust the import path

// Fetch all users
export const useFetchUsers = () => {
  const firestore = getFirestore();

  const fetchUsers = async (): Promise<UserInfoDTO[]> => {
    const usersCollection = collection(firestore, 'users');
    const snapshot = await getDocs(usersCollection);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.FirstName || 'N/A', // Correct field casing
        lastName: data.LastName || 'N/A',
        dob: data.DOB || '',
        gender: data.Gender || '',
        bio: data.Bio || '',
        profileImageUrl: data.profileImageUrl || '',
        role: data.Role || 'User',  // Correct casing for the role
        createdAt: data.CreatedAt || '',
        email: data.Email || 'N/A',
      } as UserInfoDTO;
    });
  };

  return useQuery({
    queryKey: ['users'],  // Pass the query key
    queryFn: fetchUsers   // Pass the fetch function
  });
};
