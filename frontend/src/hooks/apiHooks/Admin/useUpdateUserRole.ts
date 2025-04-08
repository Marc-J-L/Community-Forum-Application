import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

// Update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  // Define the mutation function
  const updateUserRole = async ({ uid, role }: { uid: string, role: string }) => {
    const firestore = getFirestore();
    const userDoc = doc(firestore, 'users', uid);
    await updateDoc(userDoc, { Role: role });
  };

  // Return the useMutation hook
  return useMutation({
    mutationFn: updateUserRole, // Specify the mutation function correctly
    onSuccess: () => {
      // Fix for invalidateQueries
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Correct usage
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
    }
  });
};
