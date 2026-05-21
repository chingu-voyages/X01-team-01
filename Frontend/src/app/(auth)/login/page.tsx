"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { setGuestMode } from "@/redux/features/authslice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className="max-h-[90vh] md:min-h-screen w-full grid place-items-center bg-slate-50">
      <div className="w-[90%] sm:max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="tracking-tighter font-normal text-2xl sm:text-3xl">
            AI Helper
          </h1>
          <h3 className="tracking-tighter font-light text-xl sm:text-2xl text-black/70">
            Build better prompts.
          </h3>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <p className="tracking-tight text-center text-sm sm:text-base text-black/70">
            Sign in with:
          </p>
          <Button variant="default" className="h-10">
            GitHub
          </Button>
          <div className="flex items-center w-full my-2">
            <div className="grow border-t border-slate-300" />
            <span className="mx-4 text-sm font-medium text-slate-500 tracking-wider">
              or
            </span>
            <div className="grow border-t border-slate-300" />
          </div>
          <Button variant="secondary" className="h-10">
            Google
          </Button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              dispatch(setGuestMode())
              router.push("/home")
            }}
            className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-3 font-medium transition-colors mt-4 block mx-auto"
          >
            Continue without signing in.
          </button>
        </div>
      </div>
    </div>
  );
}