"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { UserPlus, Pencil, Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  const fetchTeam = () =>
    fetch("/api/team")
      .then((r) => r.json())
      .then(setMembers);

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    fetchTeam();
  };

  return (
    <div>
      <PageHeader title="Our team">
        <Button variant="outline">
          <UserPlus className="h-4 w-4" /> Add admin
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg border border-gray-200 p-5 flex gap-4 relative"
          >
            <div className="absolute top-4 right-4 flex gap-2 text-gray-400">
              <Pencil className="h-4 w-4 hover:text-gray-600 cursor-pointer" />
              <button onClick={() => handleDelete(member.id)}>
                <Trash2 className="h-4 w-4 hover:text-red-500 cursor-pointer" />
              </button>
            </div>

            <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
              <Image
                src={member.avatar || `https://i.pravatar.cc/150?u=${member.email}`}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="font-semibold text-[#1a2b4b]">{member.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{member.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-0.5 h-4 bg-[#4ebce9]" />
                <p className="text-sm text-[#1a2b4b]">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
