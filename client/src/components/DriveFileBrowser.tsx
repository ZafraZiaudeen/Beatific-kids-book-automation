import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest, resolveApiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { DriveBrowserFile, DriveBrowserResponse } from "@/types/app";
import { ChevronLeft, Folder, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type DriveFileBrowserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint: string;
  mode: "single" | "multi";
  title: string;
  description: string;
  onConfirm: (files: DriveBrowserFile[]) => void;
  initialSelectedIds?: string[];
};

export default function DriveFileBrowser({
  open,
  onOpenChange,
  endpoint,
  mode,
  title,
  description,
  onConfirm,
  initialSelectedIds = [],
}: DriveFileBrowserProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DriveBrowserResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  // Keep a ref so the open-effect always reads the latest initialSelectedIds
  // without needing it as a dep (a new array literal on every render would
  // cause an infinite setState loop via Object.is inequality).
  const initialSelectedIdsRef = useRef(initialSelectedIds);
  initialSelectedIdsRef.current = initialSelectedIds;

  useEffect(() => {
    if (open) {
      setSelectedIds(initialSelectedIdsRef.current);
      setCurrentFolderId(null);
      setFolderHistory([]);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const suffix = currentFolderId ? `?folderId=${encodeURIComponent(currentFolderId)}` : "";
        const payload = await apiRequest<DriveBrowserResponse>(`${endpoint}${suffix}`);
        if (!cancelled) {
          setResponse(payload);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [currentFolderId, endpoint, open]);

  const filteredFolders = useMemo(() => {
    return (response?.folders || []).filter((folder) =>
      folder.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, response?.folders]);

  const filteredFiles = useMemo(() => {
    return (response?.files || []).filter((file) =>
      file.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, response?.files]);

  const selectedFiles = useMemo(() => {
    const files = response?.files || [];
    return selectedIds
      .map((id) => files.find((file) => file.id === id))
      .filter(Boolean) as DriveBrowserFile[];
  }, [response?.files, selectedIds]);

  const openFolder = (folderId: string) => {
    if (response?.folderId) {
      setFolderHistory((current) => [...current, response.folderId]);
    }
    setCurrentFolderId(folderId);
  };

  const goBack = () => {
    setFolderHistory((current) => {
      const next = [...current];
      const previous = next.pop() || null;
      setCurrentFolderId(previous);
      return next;
    });
  };

  const toggleSelect = (fileId: string) => {
    setSelectedIds((current) => {
      if (mode === "single") {
        return current[0] === fileId ? [] : [fileId];
      }

      return current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId];
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!folderHistory.length}
            onClick={goBack}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a82aa]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search folders or files"
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4 overflow-hidden lg:grid-cols-[220px_1fr]">
          <div className="rounded-2xl border border-[#ebe5f8] bg-white/80 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a82aa]">
              Folders
            </p>
            <div className="mt-3 space-y-2">
              {filteredFolders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => openFolder(folder.id)}
                  className="flex w-full items-center gap-2 rounded-xl border border-[#ece7fb] px-3 py-2 text-left text-sm font-medium text-[#2e255c] transition hover:bg-[#faf7ff]"
                >
                  <Folder className="h-4 w-4 text-[#7b4ef2]" />
                  <span className="truncate">{folder.name}</span>
                </button>
              ))}
              {!filteredFolders.length && (
                <p className="text-sm text-[#8a82aa]">No folders in this view.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ebe5f8] bg-white/80 p-3">
            <div className="grid max-h-[50vh] gap-3 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                <div className="col-span-full flex items-center gap-2 text-sm text-[#756d97]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading files...
                </div>
              ) : null}

              {!isLoading && filteredFiles.length === 0 ? (
                <p className="col-span-full text-sm text-[#8a82aa]">
                  No files found in this folder.
                </p>
              ) : null}

              {filteredFiles.map((file) => {
                const selected = selectedIds.includes(file.id);
                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => toggleSelect(file.id)}
                    className={cn(
                      "overflow-hidden rounded-2xl border text-left transition",
                      selected
                        ? "border-[#7a50ef] bg-[#f8f3ff] shadow-[0_12px_26px_rgba(120,79,244,0.12)]"
                        : "border-[#ece7fb] bg-white hover:border-[#d7c9ff]",
                    )}
                  >
                    <div className="aspect-[0.78] overflow-hidden bg-[#f5f1ff]">
                      <img
                        src={resolveApiUrl(file.previewUrl)}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold text-[#281f58]">
                        {file.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(selectedFiles)}
            disabled={!selectedIds.length}
          >
            Use selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
