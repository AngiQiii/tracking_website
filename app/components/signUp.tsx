"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import type { User } from "../page";
import { supabase } from "@/lib/supabase";

type SignUpProps = {
  setOpenPopup: (value: boolean) => void;
  setUser: (user: User) => void;
};

export default function SignUp({ setOpenPopup, setUser }: SignUpProps) {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  function emailOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    setSignUpEmail(event.target.value);
  }
  function passwordOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    setSignUpPassword(event.target.value);
  }

  async function SignUpFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
    });

    if (error) {
      console.log(error.message);
      return;
    }

    console.log("User created:", data);
    setOpenPopup(false);
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center gap-5">
        <h3 className="text-center">Create an account</h3>
        <form
          onSubmit={SignUpFormSubmitHandler}
          className="flex flex-col items-center justify-center gap-5"
        >
          <input
            placeholder="email*"
            required
            type="email"
            value={signUpEmail}
            name="email"
            onChange={emailOnChangeHandler}
            className="bg-primary text-black/80 rounded-full py-2 px-5"
          />
          <input
            placeholder="password*"
            required
            value={signUpPassword}
            name="password"
            onChange={passwordOnChangeHandler}
            className="bg-primary text-black/80 rounded-full py-2 px-5"
          />
          <button
            type="submit"
            className="bg-buttons py-2 px-5 rounded-full text-black/80 text-[14px] cursor-pointer self-start"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
