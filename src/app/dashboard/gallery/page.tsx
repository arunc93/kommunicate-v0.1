"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

interface GalleryProject {
  id: string;
  title: string;
  imageUrl: string;
}

interface GalleryCategory {
  id: string;
  title: string;
  gradient: string;
  hasPptIcon: boolean;
}

export default function GalleryPage() {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.projects);
        setCategories(data.categories);
      });
  }, []);

  return (
    <div>
      <PageHeader title="Gallery" />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h2 className="text-lg font-semibold text-[#1a2b4b] mb-4">Recent projects</h2>
            <div className="grid grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-medium leading-tight">
                      {project.title}
                    </p>
                    <div className="w-8 h-0.5 bg-[#e91e8c] mt-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1a2b4b] mb-4">Categories</h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={cn(
                    "relative rounded-lg p-6 min-h-[100px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity bg-gradient-to-r",
                    cat.gradient
                  )}
                >
                  {cat.hasPptIcon && (
                    <span className="absolute top-3 left-3 text-white/80 text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded">
                      P
                    </span>
                  )}
                  <p className="text-white text-lg font-semibold text-center leading-tight">
                    {cat.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
