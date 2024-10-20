import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { AxiosError, CanceledError } from "axios";
import { UserTableData } from "../../interfaces/User";
import { User } from "../../interfaces/User";

const useUsers = () => {
  const [users, setUsers] = useState<UserTableData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const service = "/api/users";

  const reloadUsers = () => {
    setLoading(true);

    httpClient
      .get<UserTableData[]>(service)
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const createUser = async (newUser: User) => {
    setLoading(true);

    try {
      const res = await httpClient.post<UserTableData>(service, newUser);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUser: UserTableData) => {
    setLoading(true);

    try {
      const res = await httpClient.put<UserTableData>(
        `${service}/${updatedUser.id}`,
        updatedUser
      );
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);

    try {
      const res = await httpClient.delete(`${service}/${userId}`);
      return res.data;
    } catch (err) {
      if (err instanceof CanceledError) return;

      const axiosError = err as AxiosError;
      setError(axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    reloadUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useUsers;
