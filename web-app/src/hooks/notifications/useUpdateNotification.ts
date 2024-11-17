// useUpdateUser.ts
import { useState } from "react";
import axios from "axios";
import {
  UpdateUserRequest,
  UseUpdateUserResult,
} from "../../interfaces/UserNotification";

const useUpdateNotification = (): UseUpdateUserResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (id: string, user: UpdateUserRequest) => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(`https://api.abcallg03.com/v2/system/users/${id}`, user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch {
      setError("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};

export default useUpdateNotification;
