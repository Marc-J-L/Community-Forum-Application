// src/api/apis/profile.api.ts

import { UserInfoDTO, UserUpdateDTO } from '../../types/user.type';
import { sendRequest } from './request';
import { getAuth } from 'firebase/auth';

// Define the endpoint for the profile update service
const PROFILE_UPDATE_ENDPOINT = 'ProfileUpdate';

// Fetch the current user's profile
export const getProfileInfo = async (): Promise<UserInfoDTO> => {
  const url = `${PROFILE_UPDATE_ENDPOINT}`;
  
  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error("User is not authenticated");

  const res = await sendRequest({
    method: 'GET',
    endpoint: url,
    accessToken: token
  });

  return res.data as UserInfoDTO;
};

// Update the current user's profile
export const updateProfileInfo = async (updatedProfile: UserUpdateDTO): Promise<void> => {
  const url = `${PROFILE_UPDATE_ENDPOINT}`;

  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error("User is not authenticated");

  await sendRequest({
    method: 'PUT',
    endpoint: url,
    body: updatedProfile,
    accessToken: token
  });
};
