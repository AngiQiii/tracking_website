"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: number;
  image: string;
};

type Props = {
  onCreate: (profile: Profile) => void;
  onCancel: () => void;
};

export default function CreateProfile({ onCreate, onCancel }: Props) {
  const [file, setFile] = useState<File | null>(null);

  function imageChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  }

  async function createProfileSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) return;

    // get logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // unique filename
    const fileExt = file.name.split(".").pop();

    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    // upload image
    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file);

    if (uploadError) {
      console.log(uploadError.message);
      return;
    }

    // get public image URL
    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    // save in database and get the created profile record
    const { data: insertedData, error: dbError } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        image: imageUrl,
      })
      .select("id,image")
      .single();

    if (dbError || !insertedData) {
      console.log(dbError?.message ?? "Failed to insert profile.");
      return;
    }

    // update local UI with the full profile object
    onCreate(insertedData);
  }
  return (
    <div className="w-85.75 h-screen mx-auto flex flex-col items-center justify-center gap-5 max-mobile:w-60">
      <div className="text-center">
        <h3>Create a profile for your database</h3>
        <p>Choose a image for your profile</p>
      </div>
      <form
        onSubmit={createProfileSubmitHandler}
        className="flex flex-col items-center justify-center gap-5"
      >
        <input
          required
          type="file"
          accept="image/*"
          onChange={imageChangeHandler}
          className="bg-primary text-black/80 rounded-full py-2 px-5 max-mobile:w-60"
        />

        <button
          type="submit"
          className="bg-buttons py-2 px-5 rounded-full text-black/80 text-[14px] cursor-pointer self-start"
        >
          Submit
        </button>
      </form>
      <button
        type="button"
        onClick={onCancel}
        className="bg-buttons py-2 px-5 rounded-full text-black/80 text-[14px] cursor-pointer self-start"
      >
        Cancel
      </button>
    </div>
  );
}
