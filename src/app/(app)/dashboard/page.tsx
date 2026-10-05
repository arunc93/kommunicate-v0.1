"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatShortDate } from "@/lib/utils";
import { REQUEST_STATUSES } from "@/lib/types";
import { downloadDashboardExport } from "@/features/requests/dashboard-export";
import {
  Search,
  RefreshCw,
  Filter,
  FileDown,
  Trash2,
  ChevronLeft,
  X,
} from "lucide-react";

interface Request {
  id: string;
  projectNumber: number;
  projectName: string;
  description?: string;
  requestedOn: string;
  requestedBy: string;
  deadline?: string;
  status: string;
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    requestedBy: "",
    from: "",
    to: "",
    deadline: "",
  });

  const fetchRequests = async (nextSearch = search, nextFilters = filters) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextFilters.status) params.set("status", nextFilters.status);
    if (nextFilters.requestedBy) params.set("requestedBy", nextFilters.requestedBy);
    if (nextFilters.from) params.set("from", nextFilters.from);
    if (nextFilters.to) params.set("to", nextFilters.to);
    if (nextFilters.deadline) params.set("deadline", nextFilters.deadline);

    const res = await fetch(`/api/requests?${params}`);
    const data = await res.json();
    if (Array.isArray(data)) setRequests(data);
    setLoaded(true);
  };

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!showAdvanced) return;
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.status) params.set("status", filters.status);
    if (filters.requestedBy) params.set("requestedBy", filters.requestedBy);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.deadline) params.set("deadline", filters.deadline);

    fetch(`/api/requests?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
        setLoaded(true);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });

    return () => controller.abort();
  }, [showAdvanced, filters, search]);

  const emptyFilters = { status: "", requestedBy: "", from: "", to: "", deadline: "" };

  const showOriginalDashboard = () => {
    setSearch("");
    setFilters(emptyFilters);
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      });
  };

  const handleReset = () => {
    showOriginalDashboard();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Queue"
        title="Dashboard"
        description="Search the shared desk, filter, and open a request."
      />

      {showAdvanced ? (
        <div className="panel mb-4 flex flex-wrap items-end gap-3 p-4">
          <button onClick={() => setShowAdvanced(false)} className="text-text-muted hover:text-text" aria-label="Close filters">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Input label="From" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <Input label="To" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
          <Select
            label="Status"
            options={[
              { value: "", label: "All" },
              ...REQUEST_STATUSES.map((status) => ({ value: status, label: status })),
            ]}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
          <Select
            label="Requested by"
            options={[
              { value: "", label: "All" },
              { value: "Chacko, Arun", label: "Chacko, Arun" },
              { value: "Rakshit, Abhirup", label: "Rakshit, Abhirup" },
              { value: "Tanwar, Dheeraj", label: "Tanwar, Dheeraj" },
            ]}
            value={filters.requestedBy}
            onChange={(e) => setFilters({ ...filters, requestedBy: e.target.value })}
          />
          <Input label="Deadline" type="date" value={filters.deadline} onChange={(e) => setFilters({ ...filters, deadline: e.target.value })} />
          <Button
            type="button"
            onClick={() => setFilters(emptyFilters)}
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
          <Button type="button" variant="outline" onClick={() => downloadDashboardExport(requests, true)}>
            <FileDown className="h-4 w-4" /> Export
          </Button>
        </div>
      ) : (
        <div className="panel mb-4 flex flex-col gap-2.5 p-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:min-w-[220px] sm:flex-1">
            <input
              type="text"
              placeholder="Search using project name or number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  fetchRequests();
                }
              }}
              className="field pr-8"
            />
            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={showOriginalDashboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => fetchRequests()}>
              <Search className="h-4 w-4" /> Search
            </Button>
            <Button variant="outline" onClick={() => setShowAdvanced(true)}>
              <Filter className="h-4 w-4" /> Advanced filter
            </Button>
            <Button type="button" variant="outline" onClick={() => downloadDashboardExport(requests, false)}>
              <FileDown className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline"><Trash2 className="h-4 w-4" /> Bin</Button>
          </div>
        </div>
      )}

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project name</th>
                {!showAdvanced && <th>Description</th>}
                <th>Requested on</th>
                {showAdvanced && <th>Requested by</th>}
                {showAdvanced && <th>Deadline</th>}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loaded && requests.length === 0 ? (
                <tr>
                  <td colSpan={showAdvanced ? 7 : 6} className="text-text-muted">
                    {showAdvanced ? "No requests match these filters." : "No requests yet."}
                  </td>
                </tr>
              ) : null}
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="font-bold text-text">{req.projectNumber}</td>
                  <td>
                    <Link
                      href={`/requests/${req.projectNumber}`}
                      className="font-bold text-text hover:text-cobalt"
                    >
                      {req.projectName}
                    </Link>
                  </td>
                  {!showAdvanced && (
                    <td className="max-w-[200px] truncate">
                      {req.description || req.projectName}
                    </td>
                  )}
                  <td>{formatShortDate(req.requestedOn)}</td>
                  {showAdvanced && <td>{req.requestedBy}</td>}
                  {showAdvanced && <td>{req.deadline ? formatShortDate(req.deadline) : ""}</td>}
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td>
                    <Link
                      href={`/requests/${req.projectNumber}`}
                      className="font-bold text-cobalt hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!showAdvanced && (
        <div className="mt-3 flex justify-end">
          <button onClick={handleReset} className="text-text-muted hover:text-text" aria-label="Reset">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
