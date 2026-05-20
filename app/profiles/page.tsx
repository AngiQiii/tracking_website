"use client";

import { useEffect, useState } from "react";
import CreateProfile from "../components/profile/createProfile";
import ProfileCard from "../components/profile/profileCard";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: number;
  image: string;
};

export default function Profiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [mode, setMode] = useState<"list" | "create">("list");

  async function fetchProfiles() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log(error.message);
      return;
    }

    setProfiles(data);
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  function addProfile(profile: Profile) {
    setProfiles((prev) => [...prev, profile]);
    setMode("list");
  }

  return (
    <div className="w-full p-10 max-mobile:p-2">
      <h3 className="text-center text-2xl mb-10 max-mobile:mb-2">Profiles</h3>
      {mode === "create" ? (
        <CreateProfile onCreate={addProfile} onCancel={() => setMode("list")} />
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-5">
          <div className="grid grid-cols-3 gap-4 items-center justify-center max-mobile:grid-cols-1">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                id={profile.id}
                image={profile.image}
              />
            ))}
          </div>

          <button
            className="w-full bg-buttons py-2 px-5 rounded-full text-black/80 text-[14px] cursor-pointer"
            onClick={() => setMode("create")}
          >
            Add Profile
          </button>
        </div>
      )}
    </div>
  );
}
