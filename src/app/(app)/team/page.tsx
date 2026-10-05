"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppRole } from "@/features/auth/role-context";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

const TEAM_ROLES = ["Communication lead", "Design lead", "Designer", "Content lead"];

const emptyForm = { name: "", email: "", role: "" };

export default function TeamPage() {
  const role = useAppRole();
  const canEdit = role === "lead";
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const fetchTeam = () =>
    fetch("/api/team")
      .then((response) => response.json())
      .then(setMembers);

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setAdding(true);
    setForm(emptyForm);
    setError("");
  };

  const openEdit = (member: TeamMember) => {
    setAdding(false);
    setEditingId(member.id);
    setForm({ name: member.name, email: member.email, role: member.role });
    setError("");
  };

  const closeForm = () => {
    setAdding(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.role) {
      setError("Fill in name, email, and role.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Enter an email address.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };
    const response = await fetch(editingId ? `/api/team/${editingId}` : "/api/team", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      setError("Could not save that team member.");
      return;
    }
    closeForm();
    fetchTeam();
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/team/${id}`, { method: "DELETE" });
    if (response.ok) fetchTeam();
  };

  return (
    <div>
      <PageHeader eyebrow="People" title="Our team" description="Meet our team.">
        {canEdit && (
          <Button type="button" variant="outline" onClick={openAdd}>
            <UserPlus className="h-4 w-4" /> Add admin
          </Button>
        )}
      </PageHeader>

      {(adding || editingId) && canEdit && (
        <div className="panel mb-6 grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            label="Email"
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <Select
            label="Role"
            required
            placeholder="Find items"
            options={TEAM_ROLES.map((item) => ({ value: item, label: item }))}
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
          />
          <div className="flex items-end gap-2">
            <Button type="button" onClick={save}>
              Save
            </Button>
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
          </div>
          {error && <p className="text-sm text-error md:col-span-4">{error}</p>}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {members.map((member) => (
          <div key={member.id} className="panel flex flex-wrap items-center gap-3.5 p-4">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src={member.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(member.email)}`}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <b className="block truncate text-text">{member.name}</b>
              <p className="truncate text-[13px] text-text-muted">{member.email}</p>
            </div>
            <span className="chip">{member.role}</span>
            {canEdit && (
              <div className="flex shrink-0 gap-2 text-text-muted">
                <button type="button" aria-label={`Edit ${member.name}`} onClick={() => openEdit(member)}>
                  <Pencil className="h-4 w-4 hover:text-text" />
                </button>
                <button type="button" aria-label={`Delete ${member.name}`} onClick={() => remove(member.id)}>
                  <Trash2 className="h-4 w-4 hover:text-error" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
