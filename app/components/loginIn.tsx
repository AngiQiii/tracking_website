"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import type { User } from "../page";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type LoginProps = {
  setOpenPopup: (value: boolean) => void;
  user: User;
};

export default function LoginIn({ setOpenPopup, user }: LoginProps) {
  const [loginUserName, setLoginInUserName] = useState<string>("");
  const [loginPassword, setLoginInPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const router = useRouter();

  function loginUserNameOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    setLoginInUserName(event.target.value);
  }

  function loginPasswordOnChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    setLoginInPassword(event.target.value);
  }

  async function formSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginUserName,
      password: loginPassword,
    });

    if (error) {
      setErrorMessage(true);
      return;
    }

    setErrorMessage(false);
    console.log("Logged in user:", data.user);

    router.push("/profiles");
  }

  function openSignUpPopupHandler() {
    setOpenPopup(true);
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center gap-5">
        <form
          onSubmit={formSubmitHandler}
          className="flex flex-col items-center justify-center gap-5"
        >
          <input
            placeholder="email*"
            required
            name="email"
            type="email"
            onChange={loginUserNameOnChangeHandler}
            className="bg-primary text-black/80 rounded-full py-2 px-5 max-mobile:w-75"
          />
          <input
            placeholder="password*"
            required
            name="password"
            onChange={loginPasswordOnChangeHandler}
            className="bg-primary text-black/80 rounded-full py-2 px-5 max-mobile:w-75"
          />
          <div className="w-58.75 flex items-center justify-between max-mobile:w-75">
            <button
              type="submit"
              className="bg-buttons py-2 px-5 rounded-full text-black/80 text-[14px] cursor-pointer"
            >
              Submit
            </button>
            <button onClick={openSignUpPopupHandler}>
              <p className="self-start text-[13px] cursor-pointer">Sign up</p>
            </button>
          </div>
        </form>
        {errorMessage && (
          <p className="text-red-600 text-[14px]">
            Email and/or password is incorrect
          </p>
        )}
      </div>
    </>
  );
}
