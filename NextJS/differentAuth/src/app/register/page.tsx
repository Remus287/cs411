"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  /*
  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  */

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    /*
    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }
    */

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      // todo; make this more conventional, shouldn't use weird status codes that break convention
      if (res.status === 401) {
        setError("You have a Google account");
      }
      if (res.status === 400) {
        setError("Email is already in use");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  
  return (
    sessionStatus !== "authenticated" && (

      <div className={'w-full h-full flex justify-end'} style={{
        backgroundImage: 'url(./assets/background.jpg)',
        backgroundSize: 'calc(200% / 3) 100vh',
        backgroundPosition: 'left',
        backgroundRepeat: 'no-repeat',
        
      }}>

        <section className={"w-1/3 h-full flex py-20 px-20 bg-white flex-col gap-6"}>
        <h1 className={'text-4xl font-medium border-b-4 border-blue-700 py-4'}>Register</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className={'px-4 py-2 bg-white/[.9] outline outline-1 outline-gray-300 w-full'}
              placeholder="Password"
              //required
            />
            <button
              type="submit"
              className={'bg-[#381f98] text-white py-2 px-8 mt-5 w-40'}
            >
              {" "}
              Register
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>

          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            className="block text-center text-blue-500 hover:underline mt-2"
            href="/login"
          >
            Login with an existing account
          </Link>
        </section>
      </div>
    )
  );
};

export default Register;
