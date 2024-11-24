// sonar.ignore
/* istanbul ignore file */
import { useState } from "react";
import httpClient from "../../services/HttpClient";
import { CanceledError } from "axios";
import { FeaturesObject } from "../../interfaces/Profile";

const useUsers = () => {
  const [profile, setProfile] = useState<FeaturesObject>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const service = "/user/profile";

  const getProfile = () => {
    setLoading(true);

    httpClient
      .get<FeaturesObject>(service)
      .then((res) => {
        console.log(res);
        setProfile(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return {
    profile,
    loading,
    error,
    getProfile,
  };
};

export default useUsers;