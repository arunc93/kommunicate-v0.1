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
      <PageHeader title="Dashboard" />

      {showAdvanced ? (
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-md border border-border bg-white p-4 shadow-elevation-1">
          <button onClick={() => setShowAdvanced(false)} className="text-gray-500 hover:text-gray-700">
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
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
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
              className="w-full rounded-md border border-border bg-white px-4 py-2 pr-8 text-sm text-text outline-none focus:border-cobalt"
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
          <Button type="button" onClick={() => fetchRequests()}>
            <Search className="h-4 w-4" /> Search
          </Button>
          <Button onClick={() => setShowAdvanced(true)}>
            <Filter className="h-4 w-4" /> Advanced filter
          </Button>
          <Button type="button" variant="outline" onClick={() => downloadDashboardExport(requests, false)}>
            <FileDown className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline"><Trash2 className="h-4 w-4" /> Bin</Button>
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-border bg-white shadow-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-text">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-text">Project name</th>
                {!showAdvanced && (
                  <th className="text-left px-4 py-3 font-semibold text-text">Description</th>
                )}
                <th className="text-left px-4 py-3 font-semibold text-text">Requested on</th>
                {showAdvanced && (
                  <th className="text-left px-4 py-3 font-semibold text-text">Requested by</th>
                )}
                {showAdvanced && (
                  <th className="text-left px-4 py-3 font-semibold text-text">Deadline</th>
                )}
                <th className="text-left px-4 py-3 font-semibold text-text">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loaded && requests.length === 0 ? (
                <tr>
                  <td colSpan={showAdvanced ? 7 : 6} className="px-4 py-6 text-text-muted">
                    {showAdvanced ? "No requests match these filters." : "No requests yet."}
                  </td>
                </tr>
              ) : null}
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-text">{req.projectNumber}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/requests/${req.projectNumber}`}
                      className="text-text hover:text-cobalt hover:underline"
                    >
                      {req.projectName}
                    </Link>
                  </td>
                  {!showAdvanced && (
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                      {req.description || req.projectName}
                    </td>
                  )}
                  <td className="px-4 py-3 text-gray-600">{formatShortDate(req.requestedOn)}</td>
                  {showAdvanced && (
                    <td className="px-4 py-3 text-gray-600">{req.requestedBy}</td>
                  )}
                  {showAdvanced && (
                    <td className="px-4 py-3 text-gray-600">
                      {req.deadline ? formatShortDate(req.deadline) : ""}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/requests/${req.projectNumber}`}
                      className="text-sm text-cobalt hover:underline"
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
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
