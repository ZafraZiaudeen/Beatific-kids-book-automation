import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSession } from "@/contexts/AppSessionContext";
import { apiRequest, resolveApiUrl } from "@/lib/api";
import type { BatchRun } from "@/types/app";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

const PAGE_SIZE = 6;

export default function RunsListPage() {
  const { appUser } = useAppSession();
  const [, setLocation] = useLocation();
  const [runs, setRuns] = useState<BatchRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadRuns = async () => {
    setIsLoading(true);
    try {
      const payload = await apiRequest<BatchRun[]>("/api/runs");
      setRuns(payload);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRuns();
  }, []);

  const totalPages = Math.max(1, Math.ceil(runs.length / PAGE_SIZE));
  const paginatedRuns = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return runs.slice(start, start + PAGE_SIZE);
  }, [page, runs]);

  return (
    <AppShell>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[2.25rem] font-extrabold tracking-[-0.04em] text-[#1d174b] sm:text-[2.8rem]">
            Runs
          </h1>
          <p className="mt-1 text-[0.98rem] text-[#7b7399]">
            Review submitted books, generated images, and manual upscale actions.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadRuns()}>
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </header>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {isLoading ? (
          <p className="text-[#7b7399]">Loading runs...</p>
        ) : null}

        {!isLoading && !paginatedRuns.length ? (
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>No runs yet</CardTitle>
              <CardDescription>
                Submit a new batch run to start generating books.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {paginatedRuns.map((run) => {
          const preview =
            run.pages.find((page) => page.upscaledPersonalized)?.upscaledPersonalized?.previewPath ||
            run.pages.find((page) => page.personalized)?.personalized?.previewPath ||
            run.referencePages[0]?.previewUrl ||
            run.sourceAssets[0]?.previewUrl ||
            "";

          return (
            <Card key={run.id} className="overflow-hidden border-[#ebe5f8] bg-white/88">
              <div className="grid md:grid-cols-[200px_1fr]">
                <div className="aspect-[0.92] bg-[#f5f1ff]">
                  {preview ? (
                    <img
                      src={resolveApiUrl(preview)}
                      alt={run.orderLabel}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-[1.2rem] text-[#221c4f]">
                          {run.orderLabel}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {formatDate(run.createdAt)} · {run.pages.length} pages
                        </CardDescription>
                      </div>
                      <StatusBadge status={run.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4 pb-5">
                    <div className="grid gap-2 text-sm text-[#5f567f] sm:grid-cols-2">
                      <Detail label="Quality" value={run.quality} />
                      <Detail label="Personalization" value={run.personalizationModel} />
                      <Detail label="Coloring" value={run.coloringModel} />
                      <Detail label="Submitted by" value={appUser?.role === "admin" ? run.userName : "You"} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-[#756d97]">
                        {run.sourceAssets.length} assets · {run.referencePages.length} references
                      </p>
                      <Button onClick={() => setLocation(`/runs/${run.id}`)}>
                        Open details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {runs.length > PAGE_SIZE ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <span className="text-sm text-[#6a618d]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-[#2a2156]">{label}:</span> {value}
    </p>
  );
}

export function StatusBadge({ status }: { status: BatchRun["status"] }) {
  const classes: Record<BatchRun["status"], string> = {
    queued: "bg-[#f6f2ff] text-[#7044ee]",
    processing: "bg-[#eef5ff] text-[#2f6bd9]",
    review_ready: "bg-[#eefdf6] text-[#0c8a53]",
    upscaling: "bg-[#fff5e8] text-[#d97904]",
    completed: "bg-[#eefdf6] text-[#0c8a53]",
    failed: "bg-[#fff1f2] text-[#dc2626]",
    partial_failed: "bg-[#fff7ed] text-[#c2410c]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${classes[status]}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
