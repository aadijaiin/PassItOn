"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";

type UserInfo = {
  email: string;
  
  userId?: string;
};

export function UserInfoCard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.user) {
          setUser(data.user);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-6">
        <span className="text-[#5B3DF6] font-bold">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full flex justify-center py-6">
        <span className="text-pink-500 font-bold">Not logged in</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 border-2 border-[#E0D5FA] rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 mb-8">
      <div className="bg-[#5B3DF6] rounded-full p-3 mb-2">
        <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" fill="#fff"/></svg>
      </div>
      <div className="text-lg font-bold text-[#23185B]">
        {user.email || "User"}
      </div>
      {user.userId && (
        <div className="text-xs text-[#7c689c] font-semibold">
          User ID: {user.userId}
        </div>
      )}
    </div>
  );
}