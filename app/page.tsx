"use client";

import { useState } from "react";
import LoginIn from "./components/loginIn";
import SignUp from "./components/signUp";

export type User = {
  username: string;
  password: string;
};

export default function Home() {
  const [openPopup, setOpenPopup] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  return (
    <>
      {!openPopup ? (
        <LoginIn setOpenPopup={setOpenPopup} user={user} />
      ) : (
        <SignUp setOpenPopup={setOpenPopup} setUser={setUser} />
      )}
    </>
  );
}
