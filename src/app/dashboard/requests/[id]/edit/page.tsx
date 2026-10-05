"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Paperclip } from "lucide-react";

interface Request {
  projectNumber: number;
  additionalConsideration?: string;
}

export default function RequestEditPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<Request | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch(`/api/requests/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setRequest(data);
        setComment(data.additionalConsideration || "");
      });
  }, [params.id]);

  const handleSubmit = async () => {
    await fetch(`/api/requests/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ additionalConsideration: comment }),
    });
    router.push(`/dashboard/requests/${params.id}`);
  };

  if (!request) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <PageHeader title={`${request.projectNumber} - Communication request`} />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Textarea
          label="Additional consideration"
          placeholder="If you have any suggestions or comments regarding the draft provided, please share them here."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px] bg-blue-50"
        />

        <div className="mt-4 flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1a2b4b]">Attachments</label>
          <div className="rounded border border-gray-200 bg-[#f5f5f5] px-3 py-2 text-sm text-gray-500">
            There is nothing attached.{" "}
            <button className="text-[#4e5d94] inline-flex items-center gap-1 hover:underline">
              <Paperclip className="h-3 w-3" /> Attach file
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} size="lg">
          Submit <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
