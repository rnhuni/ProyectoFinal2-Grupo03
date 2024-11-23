import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import useProfile from "../hooks/profile/useProfile";
import { FeaturesObject } from "../interfaces/Profile";

interface ProfileContextProps {
  profile: FeaturesObject | undefined;
  error: string | null;
  isLoading: boolean;
  language: string;
  setLanguage: (language: string) => void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined
);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { profile, error, getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    (async () => {
      await getProfile();
      setIsLoading(false);
    })();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile: profile ? { ...profile, language } : undefined,
        error,
        isLoading,
        language,
        setLanguage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = (): ProfileContextProps => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
