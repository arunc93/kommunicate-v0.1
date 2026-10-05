"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatShortDate } from "@/lib/utils";
import {
  Search,
  RefreshCw,
  Clock,
  PlusSquare,
  Send,
  Filter,
  FileDown,
  Trash2,
  ChevronLeft,
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

export default function TrackRequestPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    requestedBy: "",
    from: "",
    to: "",
    deadline: "",
  });

  const fetchRequests = async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filters.status) params.set("status", filters.status);
    if (filters.requestedBy) params.set("requestedBy", filters.requestedBy);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.deadline) params.set("deadline", filters.deadline);

    const res = await fetch(`/api/requests?${params}`);
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetch("/api/requests")
      .then((r) => r.json())
      .then(setRequests);
  }, []);

  const handleReset = () => {
    setSearch("");
    setFilters({ status: "", requestedBy: "", from: "", to: "", deadline: "" });
    fetch("/api/requests")
      .then((r) => r.json())
      .then(setRequests);
  };

  return (
    <div>
      <PageHeader title="Track request">
        <Clock className="h-5 w-5 text-gray-400" />
      </PageHeader>

      {showAdvanced ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex flex-wrap items-end gap-3">
          <button onClick={() => setShowAdvanced(false)} className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Input label="From" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <Input label="To" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
          <Select
            label="Status"
            options={[
              { value: "", label: "All" },
              { value: "Brief submitted", label: "Brief submitted" },
              { value: "Design in progress", label: "Design in progress" },
              { value: "Draft delivered", label: "Draft delivered" },
              { value: "Completed", label: "Completed" },
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
          <Button onClick={fetchRequests} className="bg-[#4e5d94]">
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
          <Button variant="outline"><FileDown className="h-4 w-4" /> Export</Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search using project name or number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4ebce9]"
          />
          <Button onClick={fetchRequests} className="bg-[#4e5d94]">
            <Search className="h-4 w-4" /> Search
          </Button>
          <Button onClick={() => setShowAdvanced(true)} className="bg-[#4e5d94]">
            <Filter className="h-4 w-4" /> Advanced filter
          </Button>
          <Button variant="outline"><FileDown className="h-4 w-4" /> Export</Button>
          <Button variant="outline"><Trash2 className="h-4 w-4" /> Bin</Button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">Project name</th>
                {!showAdvanced && (
                  <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">Description</th>
                )}
                <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">Requested on</th>
                {showAdvanced && (
                  <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">Requested by</th>
                )}
                {showAdvanced && (
                  <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">Deadline</th>
                )}
                <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1a2b4b]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-[#1a2b4b]">{req.projectNumber}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/requests/${req.projectNumber}`}
                      className="text-[#1a2b4b] hover:text-[#4ebce9] hover:underline"
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
                    <div className="flex items-center gap-2 text-gray-400">
                      <Link href={`/dashboard/add-hours?project=${req.projectNumber}`}>
                        <Clock className="h-4 w-4 hover:text-[#4ebce9] cursor-pointer" />
                      </Link>
                      <Link href={`/dashboard/requests/${req.projectNumber}/edit`}>
                        <PlusSquare className="h-4 w-4 hover:text-[#4ebce9] cursor-pointer" />
                      </Link>
                      <Send className="h-4 w-4 hover:text-[#4ebce9] cursor-pointer" />
                    </div>
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
