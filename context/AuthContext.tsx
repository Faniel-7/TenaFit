import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  getUserAccount,
  saveUserAccount,
  clearUserAccount,
} from "../storage/authStorage";

import { UserAccount } from "../types/auth";

type AuthContextType = {
  user: UserAccount | null;
  isLoggedIn: boolean;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  signup: (
    account: UserAccount
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<UserAccount | null>(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * Restore the saved account when
   * the application starts.
   */
  useEffect(() => {
    restoreUser();
  }, []);

  const restoreUser = async () => {
    try {
      const account =
        await getUserAccount();

      setUser(account);
    } catch (error) {
      console.error(
        "Failed to restore authentication:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const account =
        await getUserAccount();

      if (!account) {
        return {
          success: false,
          error:
            "No account found. Please create an account first.",
        };
      }

      const enteredEmail =
        email.trim().toLowerCase();

      const savedEmail =
        account.email
          .trim()
          .toLowerCase();

      if (
        enteredEmail !== savedEmail ||
        password !== account.password
      ) {
        return {
          success: false,
          error:
            "Incorrect email or password.",
        };
      }

      setUser(account);

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      return {
        success: false,
        error:
          "Something went wrong while logging in.",
      };
    }
  };

  const signup = async (
    account: UserAccount
  ) => {
    try {
      const existingAccount =
        await getUserAccount();

      if (existingAccount) {
        return {
          success: false,
          error:
            "An account already exists. Please log in.",
        };
      }

      await saveUserAccount(
        account
      );

      setUser(account);

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Signup failed:",
        error
      );

      return {
        success: false,
        error:
          "Something went wrong while creating your account.",
      };
    }
  };

  const logout = async () => {
    try {
      /*
       * Remove the logged-in account
       * from local storage.
       */
      await clearUserAccount();

      setUser(null);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}