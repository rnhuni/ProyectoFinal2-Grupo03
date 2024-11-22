import { useState } from 'react';
import api from '../../api/api';
import { Profile } from '../../interfaces/Profile';


const useProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const service = '/user/profile';

  const reloadProfile = async (): Promise<Profile> => {
    setLoading(true);
    setError('');
    const response = await api.get<Profile>(service);
    const sortedData: Profile = response.data;
    setProfile(sortedData);
    setLoading(false);
    return sortedData;
  };


  return {
    profile,
    loading,
    error,
    reloadProfile,
  };
};

export default useProfile;
