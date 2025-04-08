import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { searchUsers } from '../../../api';
import { searchQueryKeys } from '../../../consts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useSearchUsers = (query: string) => {
    const errorHandler = useGenericErrHandler();

    return useQuery({
        queryKey: searchQueryKeys.users(query), 
        queryFn: () =>
            searchUsers(query)
                .then(res => res)
                .catch((err: AxiosError) => {
                    console.error(err);
                    errorHandler(err);
                    return null;
                }),
    });
};
