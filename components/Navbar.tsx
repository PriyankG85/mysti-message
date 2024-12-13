"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-bg-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/">
          <h1 className="text-2xl font-extrabold">MystiMessage</h1>
        </Link>

        {session ? (
          <Button onClick={() => signOut()}>Logout</Button>
        ) : (
          <Link href="/signIn">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
