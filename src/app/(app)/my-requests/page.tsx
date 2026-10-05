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
      <PageHeader
        eyebrow="Stakeholder"
        title="My requests"
        description="Requests raised for this preview. This list is the local queue, not one person's tickets."
      />

      {state === "error" ? (
        <p className="text-sm text-error">Could not load requests.</p>
      ) : state === "loading" ? (
        <p className="text-sm text-text-muted">Loading...</p>
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project name</th>
                <th>Requested on</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-text-muted">
                    No requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td className="font-bold text-text">{request.projectNumber}</td>
                    <td>
                      <Link
                        href={`/requests/${request.projectNumber}`}
                        className="font-bold text-text hover:text-cobalt"
                      >
                        {request.projectName}
                      </Link>
                    </td>
                    <td>{formatShortDate(request.requestedOn)}</td>
                    <td>
                      <StatusBadge status={request.status} />
                    </td>
                    <td>
                      <Link
                        href={`/requests/${request.projectNumber}`}
                        className="font-bold text-cobalt hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
