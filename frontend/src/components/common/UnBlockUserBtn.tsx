import {
    IconButton
} from "@mui/material";
import { RemoveCircle} from "@mui/icons-material";

import { useAuth } from "../../contexts";
import { useBlockContext } from "../../contexts/useBlockContext";

import { enqueueSnackbar } from 'notistack';

import { sendRequest } from "../../api";

interface btnProps {
    blockedUserId: string;
    action: () => void;
}

const UnBlockUserBtn = ({blockedUserId, action}: btnProps) => {
    const { accessToken } = useAuth();

    const { unBlockUser } = useBlockContext();

    async function handleUnBlock() {
        try {
            const response = await sendRequest({
                endpoint: `api/UserBlock/unblock/${blockedUserId}`,
                method: "DELETE",
                accessToken: accessToken as string
            });

            unBlockUser(blockedUserId)

            action();

            enqueueSnackbar(response.data.message, { variant: 'success' });

        } catch (error) {
            const e = error as Error;
            enqueueSnackbar(e.message, { variant: 'error' });
        }
    }

    return ( 
        <IconButton 
            color="error"
            onClick={handleUnBlock}
        >
            <RemoveCircle />
        </IconButton>
     );
}
 
export default UnBlockUserBtn;