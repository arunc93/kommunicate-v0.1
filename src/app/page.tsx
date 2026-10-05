"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="login-gradient min-h-screen flex items-center justify-start pl-16 relative">
      <div className="relative z-10 bg-white rounded-3xl p-10 w-[340px] shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="https://i.pravatar.cc/150?u=arun"
              alt="Arun"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-[#1a2b4b] font-medium">Hello, Arun!</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1a2b4b] leading-tight mb-1">
          Welcome to
        </h1>
        <h1 className="text-2xl font-bold text-[#1a2b4b] mb-6">Kommunicate</h1>

        <hr className="border-gray-200 mb-6" />

        <p className="text-sm font-bold text-[#1a2b4b] mb-8">KGS Consulting</p>

        <Button
          className="w-full justify-center bg-[#00aeef] hover:bg-[#0099d4] py-3 text-base"
          onClick={() => router.push("/dashboard/track-request")}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
