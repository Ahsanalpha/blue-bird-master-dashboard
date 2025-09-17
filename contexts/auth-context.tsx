"use client"

import { refreshAccessToken } from "@/lib/tenants";
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie";
import { Cookie } from "next/font/google";

interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  two_factor_auth: boolean;
  verified: boolean;
  created_at: string;  // ISO date string format (e.g. "2025-09-16T12:34:56Z")
  updated_at: string;  // ISO date string format
}


interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ requiresTwoFactor: boolean }>
  // verify2FA: (code: string) => Promise<void>
  logout: () => void
  signup: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = Cookies.get("access_token");
        if (token) {
          loadUserData(token).then(fetchedUser => {
           setUser(fetchedUser);
          })
          // Simulate API call to verify token and get user data
          // const mockUser: User = {
          //   id: "1",
          //   email: "admin@example.com",
          //   firstName: "Admin",
          //   lastName: "User",
          //   role: "superuser",
          //   twoFactorEnabled: true,
          // }
          // setUser(mockUser)
          document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        // localStorage.removeItem("access_token")
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const loadUserData = async (token:string) => {
    const endpoint = process.env.NEXT_PUBLIC_BASE_URL + "user/profile";
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    // if (!response.ok) {
    //   // throw new Error('Failed to fetch user data');
    //   console.log("Failed to fetch user data");
    // }
    if(response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      console.log("New Access Token:",newAccessToken)
      // Retry the original request with the new access token
      const retryResponse = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newAccessToken}`
        }
      });
      if (!retryResponse.ok) {
        throw new Error('Failed to fetch tenants after refreshing token');
      }
      const retryData = await retryResponse.json();
      return retryData.data.tenants;
    }
    const data = await response.json();
    return data.data as User;
  }

  const login = async (email: string, password: string): Promise<{ requiresTwoFactor: boolean }> => {
    setIsLoading(true)
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      const authEndpoint = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(authEndpoint + "auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      })
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      console.log("AUTH DATA",data);

      if (data) {
        // const mockUser: User = {
        //   id: number;
        //   email: string;
        //   first_name: string;
        //   middle_name: string;
        //   last_name: string;
        //   phone_number: string;
        //   two_factor_auth: boolean;
        //   verified: boolean;
        //   created_at: string;  // ISO date string format (e.g. "2025-09-16T12:34:56Z")
        //   updated_at: string; // Keep this true for future 2FA implementation
        // }

        // setUser(mockUser)

        const accesstoken = data.data.access_token;
        const refreshtoken = data.data.refresh_token;
        // localStorage.setItem("refresh_token", refreshtoken);
        // localStorage.setItem("access_token", accesstoken)
        document.cookie = `access_token=${accesstoken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        document.cookie = `refresh_token=${refreshtoken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

        // Return false to skip 2FA verification
        return { requiresTwoFactor: false }
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // const verify2FA = async (code: string): Promise<void> => {
  //   setIsLoading(true)
  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     if (code === "123456") {
  //       const tempAuth = localStorage.getItem("temp_auth")
  //       if (tempAuth) {
  //         const { email } = JSON.parse(tempAuth)
  //         // const mockUser: User = {
  //         //   id: 1,
  //         //   email,
  //         //   firstName: "Admin",
  //         //   lastName: "User",
  //         //   role: "superuser",
  //         //   twoFactorEnabled: true,
  //         // }

  //         // setUser(mockUser)
  //         const token = "mock_jwt_token"
  //         localStorage.setItem("auth_token", token)
  //         document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  //         localStorage.removeItem("temp_auth")
  //       }
  //     } else {
  //       throw new Error("Invalid 2FA code")
  //     }
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const signup = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<void> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would create the user account
      console.log("User registered:", userData)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    // Cookie
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    // verify2FA,
    logout,
    signup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
