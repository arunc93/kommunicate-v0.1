"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatShortDate } from "@/lib/utils";

interface RequestRow {
  id: string;
  projectNumber: number;
  projectName: string;
  requestedOn: string;
  status: string;
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetch("/api/requests")
      .then((response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json();
      })
      .then((data: RequestRow[]) => {
        if (!Array.isArray(data)) throw new Error("load failed");
        setRequests(data);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <div>
      <PageHeader title="My requests" />
      <p className="mb-4 max-w-3xl text-sm leading-5 text-text-muted">
        Supabase is not configured. This preview shows the local queue, not one person&apos;s tickets.
      </p>

      {state === "error" ? (
        <p className="text-sm text-error">Could not load requests.</p>
      ) : state === "loading" ? (
        <p className="text-sm text-text-muted">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-white shadow-elevation-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-semibold text-text">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Project name</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Requested on</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-text-muted">
                    No requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-text">{request.projectNumber}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/requests/${request.projectNumber}`}
                        className="text-text hover:text-cobalt hover:underline"
                      >
                        {request.projectName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatShortDate(request.requestedOn)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
