import { PageHeader } from "@/components/ui/PageHeader";
import {
  HandMetal,
  Search,
  Settings,
  ThumbsUp,
  Calendar,
  Download,
} from "lucide-react";

const steps = [
  { icon: HandMetal, label: "Raise request on Kommunicate" },
  { icon: Search, label: "Check 'Track request' for progress" },
  { icon: Settings, label: "Raise request for edits, if any" },
  { icon: ThumbsUp, label: "Confirm completion to close request" },
  { icon: Calendar, label: "Check release calendar to plan release" },
];

const resources = [
  "Standard operating procedures for consulting communication team",
  "Standard turnaround time for communication delivery",
  "User guide for Kommunicate",
];

export default function SopsPage() {
  return (
    <div>
      <PageHeader title="SOPs and TATs" />

      <div className="sop-gradient rounded-lg p-8 mb-8">
        <div className="text-center mb-8">
          <span className="inline-block bg-[#4ebce9]/30 text-white text-sm px-4 py-1 rounded">
            Ready to Kommunicate?
          </span>
        </div>

        <div className="flex items-start justify-between max-w-4xl mx-auto relative">
          <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-white/30" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center w-[18%] relative z-10">
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center mb-3">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-white text-xs leading-tight">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {resources.map((title) => (
          <div
            key={title}
            className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between min-h-[140px]"
          >
            <p className="text-[#1a2b4b] text-sm leading-relaxed">{title}</p>
            <div className="flex justify-end mt-4">
              <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
