// useCreateUser.ts
import { useState } from "react";
import axios from "axios";
import { CreateUserRequest, UseCreateUserResult } from "../../interfaces/UserNotification";

const useNotificationsCreate = (): UseCreateUserResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (user: CreateUserRequest) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post("https://api.abcallg03.com/v2/system/users", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch {
      setError("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
};

export default useNotificationsCreate;
