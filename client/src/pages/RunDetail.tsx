import AppShell from "@/components/AppShell";
import AuthImage from "@/components/AuthImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import type { BatchRun } from "@/types/app";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { StatusBadge } from "./RunsList";

export default function RunDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/runs/:id");
  const runId = params?.id || "";
  const [run, setRun] = useState<BatchRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upscaleLoadingKey, setUpscaleLoadingKey] = useState<string | null>(null);

  const loadRun = async () => {
    if (!runId) {
      return;
    }

    setIsLoading(true);
    try {
      setRun(await apiRequest<BatchRun>(`/api/runs/${runId}`));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRun();
  }, [runId]);

  const requestUpscale = async (pageKeys: string[], variants: Array<"personalized" | "coloring">, key: string) => {
    setUpscaleLoadingKey(key);
    try {
      await apiRequest<BatchRun>(`/api/runs/${runId}/upscale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKeys, variants }),
      });
      await loadRun();
    } finally {
      setUpscaleLoadingKey(null);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => setLocation("/runs")}>
          <ArrowLeft className="h-4 w-4" />
          Back to runs
        </Button>
        {run ? <StatusBadge status={run.status} /> : null}
      </div>

      {isLoading ? <p className="mt-6 text-[#7b7399]">Loading run details...</p> : null}

      {run ? (
        <>
          <header className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-[2.25rem] font-extrabold tracking-[-0.04em] text-[#1d174b] sm:text-[2.8rem]">
                {run.orderLabel}
              </h1>
              <p className="mt-1 text-[0.98rem] text-[#7b7399]">
                Submitted {formatDate(run.createdAt)} by {run.userName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <UpscaleButton
                label="Upscale all"
                loading={upscaleLoadingKey === "all-both"}
                onClick={() => void requestUpscale([], ["personalized", "coloring"], "all-both")}
              />
              <UpscaleButton
                label="Upscale personalized"
                loading={upscaleLoadingKey === "all-personalized"}
                onClick={() => void requestUpscale([], ["personalized"], "all-personalized")}
              />
              <UpscaleButton
                label="Upscale coloring"
                loading={upscaleLoadingKey === "all-coloring"}
                onClick={() => void requestUpscale([], ["coloring"], "all-coloring")}
              />
            </div>
          </header>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card className="border-[#ebe5f8] bg-white/86">
              <CardHeader>
                <CardTitle>Submission Details</CardTitle>
                <CardDescription>Generation settings captured for this run.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#5f567f]">
                <Detail label="Quality" value={run.quality} />
                <Detail label="Personalization model" value={run.personalizationModel} />
                <Detail label="Coloring model" value={run.coloringModel} />
                <Detail label="Drive folder" value={run.driveOutputFolderName} />
                <Detail label="Redo notes" value={run.redoNotes || "None"} />
              </CardContent>
            </Card>

            <Card className="border-[#ebe5f8] bg-white/86 lg:col-span-2">
              <CardHeader>
                <CardTitle>Source Assets</CardTitle>
                <CardDescription>Uploaded or Drive-selected input images.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {run.sourceAssets.map((asset) => (
                  <PreviewCard
                    key={`${asset.slot}-${asset.driveFileId}`}
                    title={asset.label}
                    subtitle={`${asset.source} · ${asset.fileName}`}
                    image={asset.previewUrl || ""}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-[#ebe5f8] bg-white/86">
            <CardHeader>
              <CardTitle>Reference Pages</CardTitle>
              <CardDescription>The book illustrations selected for this run.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {run.referencePages.map((page) => (
                <PreviewCard
                  key={page.id}
                  title={page.name}
                  subtitle="Reference page"
                  image={page.previewUrl}
                />
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6 border-[#ebe5f8] bg-white/86">
            <CardHeader>
              <CardTitle>Generated Pages</CardTitle>
              <CardDescription>Review outputs and request manual upscaling after approval.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {run.pages.map((page) => (
                <div
                  key={page.pageKey}
                  className="rounded-[22px] border border-[#ece6fb] bg-white/82 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#251d54]">
                        {page.referencePageName}
                      </h3>
                      <p className="mt-1 text-sm text-[#7b7399]">
                        {page.pageKey} · generation: {page.generationStatus.replaceAll("_", " ")}
                        {" · "}upscale: {page.upscaleStatus.replaceAll("_", " ")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <UpscaleButton
                        label="Upscale both"
                        loading={upscaleLoadingKey === `${page.pageKey}-both`}
                        onClick={() =>
                          void requestUpscale([page.pageKey], ["personalized", "coloring"], `${page.pageKey}-both`)
                        }
                      />
                      <UpscaleButton
                        label="Personalized only"
                        loading={upscaleLoadingKey === `${page.pageKey}-personalized`}
                        onClick={() =>
                          void requestUpscale([page.pageKey], ["personalized"], `${page.pageKey}-personalized`)
                        }
                      />
                      <UpscaleButton
                        label="Coloring only"
                        loading={upscaleLoadingKey === `${page.pageKey}-coloring`}
                        onClick={() =>
                          void requestUpscale([page.pageKey], ["coloring"], `${page.pageKey}-coloring`)
                        }
                      />
                    </div>
                  </div>

                  {page.errorMessage ? (
                    <p className="mt-3 rounded-xl bg-[#fff1f2] px-3 py-2 text-sm text-[#dc2626]">
                      {page.errorMessage}
                    </p>
                  ) : null}

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <VariantCard title="Personalized" image={page.personalized?.previewPath} />
                    <VariantCard title="Coloring" image={page.coloring?.previewPath} />
                    <VariantCard title="Upscaled Personalized" image={page.upscaledPersonalized?.previewPath} />
                    <VariantCard title="Upscaled Coloring" image={page.upscaledColoring?.previewPath} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : null}
    </AppShell>
  );
}

function PreviewCard({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#ece6fb] bg-white">
      <div className="aspect-[0.8] bg-[#f5f1ff]">
        {image ? (
          <AuthImage src={image} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-[#251d54]">{title}</p>
        <p className="truncate text-xs text-[#7b7399]">{subtitle}</p>
      </div>
    </div>
  );
}

function VariantCard({ title, image }: { title: string; image?: string }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#ece6fb] bg-[#fcfbff]">
      <div className="aspect-[0.8] bg-[#f5f1ff]">
        {image ? (
          <AuthImage src={image} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-[#251d54]">{title}</p>
      </div>
    </div>
  );
}

function UpscaleButton({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      {label}
    </Button>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-[#2a2156]">{label}:</span> {value}
    </p>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
