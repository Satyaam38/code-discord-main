import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useAuth() {
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserEmail(user.email);
    };
    fetchUser();
  }, []);

  return { currentUserEmail };
}