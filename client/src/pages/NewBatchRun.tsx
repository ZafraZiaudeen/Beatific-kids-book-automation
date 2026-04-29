import AppShell from "@/components/AppShell";
import DriveFileBrowser from "@/components/DriveFileBrowser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, resolveApiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { BatchRun, DriveBrowserFile, ReferencePage, SourceAsset } from "@/types/app";
import {
  CloudUpload,
  Crown,
  Diamond,
  FileImage,
  FileText,
  Info,
  NotebookPen,
  Plus,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import kid1Img from "@/assets/kid-1.webp";
import kid2Img from "@/assets/kid-2.webp";
import dog1Img from "@/assets/dog1.webp";
import dog2Img from "@/assets/dog2.webp";

const steps = [
  "Basic Details",
  "Upload Photos",
  "Reference Pages",
  "Correction Notes",
  "Review & Generate",
];

const uploadSlots = [
  {
    key: "child1",
    label: "Kid One",
    cardClassName:
      "border-[#d9e8ff] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#edf5ff_0%,#ffffff_100%)]",
  },
  {
    key: "child2",
    label: "Kid Two",
    cardClassName:
      "border-[#f5d8eb] bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#fff0f7_0%,#ffffff_100%)]",
  },
  {
    key: "dog1",
    label: "Dog One",
    cardClassName:
      "border-[#f9e6c7] bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#fff5df_0%,#ffffff_100%)]",
  },
  {
    key: "dog2",
    label: "Dog Two",
    cardClassName:
      "border-[#d8f0e5] bg-[linear-gradient(180deg,#f5fffb_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#ebfaf3_0%,#ffffff_100%)]",
  },
] as const;

const qualityOptions = [
  "HD (1024x1024) - Standard",
  "Full HD (1536x1024) - High",
  "Ultra HD (2048x1536) - Best",
];

const modelOptions = [
  "ChatGPT Image 2 (Best Quality)",
  "Flux Kontext Pro (Recommended)",
  "Flux Kontext Pro (Balanced)",
  "Nano Banana (Fast & Cheap)",
];

const referenceCardStyles = [
  "border-[#dbe7ff] bg-[linear-gradient(180deg,#eef5ff_0%,#dbe9ff_100%)]",
  "border-[#f6e2ba] bg-[linear-gradient(180deg,#fff8e8_0%,#fdeac5_100%)]",
  "border-[#d9d7ff] bg-[linear-gradient(180deg,#f0efff_0%,#dddbff_100%)]",
  "border-[#ddeaff] bg-[linear-gradient(180deg,#edf8ff_0%,#dbefff_100%)]",
  "border-[#e9e1c5] bg-[linear-gradient(180deg,#f7f4e9_0%,#ece3c8_100%)]",
  "border-[#f3d8df] bg-[linear-gradient(180deg,#fff1f6_0%,#f8dbe6_100%)]",
];

export default function NewBatchRun() {
  const [, setLocation] = useLocation();
  const [orderLabel, setOrderLabel] = useState("Beatific kids book");
  const [quality, setQuality] = useState("Ultra HD (2048x1536) - Best");
  const [personalizationModel, setPersonalizationModel] = useState("ChatGPT Image 2 (Best Quality)");
  const [coloringModel, setColoringModel] = useState("Flux Kontext Pro (Recommended)");
  const [redoNotes, setRedoNotes] = useState("");
  const [assetsBySlot, setAssetsBySlot] = useState<Partial<Record<(typeof uploadSlots)[number]["key"], SourceAsset>>>({});
  const [selectedReferencePages, setSelectedReferencePages] = useState<ReferencePage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [sourceBrowserSlot, setSourceBrowserSlot] = useState<(typeof uploadSlots)[number]["key"] | null>(null);
  const [referenceBrowserOpen, setReferenceBrowserOpen] = useState(false);

  const sourceAssets = useMemo(
    () => uploadSlots.map((slot) => assetsBySlot[slot.key]).filter(Boolean) as SourceAsset[],
    [assetsBySlot],
  );

  const handleLocalUpload = async (slot: (typeof uploadSlots)[number], file: File) => {
    setUploadingSlot(slot.key);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("slot", slot.key);
      formData.append("label", slot.label);
      const response = await apiRequest<{ assets: SourceAsset[] }>("/api/assets/uploads", {
        method: "POST",
        body: formData,
      });
      const asset = response.assets[0];
      setAssetsBySlot((current) => ({ ...current, [slot.key]: asset }));
    } finally {
      setUploadingSlot(null);
    }
  };

  const assignDriveAsset = (file: DriveBrowserFile) => {
    if (!sourceBrowserSlot) {
      return;
    }

    const slot = uploadSlots.find((entry) => entry.key === sourceBrowserSlot);
    if (!slot) {
      return;
    }

    setAssetsBySlot((current) => ({
      ...current,
      [slot.key]: {
        slot: slot.key,
        label: slot.label,
        fileName: file.name,
        driveFileId: file.id,
        mimeType: file.mimeType,
        previewUrl: file.previewUrl,
        source: "drive",
      },
    }));
    setSourceBrowserSlot(null);
  };

  const removeReferencePage = (pageId: string) => {
    setSelectedReferencePages((current) => current.filter((page) => page.id !== pageId));
  };

  const submitRun = async () => {
    setIsSubmitting(true);
    try {
      const createdRun = await apiRequest<BatchRun>("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderLabel,
          quality,
          personalizationModel,
          coloringModel,
          redoNotes,
          sourceAssets,
          selectedReferencePageIds: selectedReferencePages.map((page) => page.id),
        }),
      });
      setLocation(`/runs/${createdRun.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create run. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <header>
        <h1 className="text-[2.25rem] font-extrabold tracking-[-0.04em] text-[#1d174b] sm:text-[2.9rem]">
          New Batch Run
        </h1>
      </header>

      <section className="mt-5 grid gap-4 sm:grid-cols-5 sm:gap-3">
        {steps.map((step, index) => {
          const isActive = index === 0;

          return (
            <div key={step} className="relative">
              {index < steps.length - 1 ? (
                <div className="absolute left-[calc(50%+1.35rem)] right-[-50%] top-[1.05rem] hidden h-px bg-[#d8d2e8] sm:block" />
              ) : null}
              <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-0">
                <div className="flex items-center sm:justify-center">
                  <div
                    className={cn(
                      "flex h-[2.15rem] w-[2.15rem] shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                      isActive
                        ? "border-[#7244f2] bg-[linear-gradient(135deg,#7346f3_0%,#9b61ff_100%)] text-white shadow-[0_10px_22px_rgba(120,79,244,0.24)]"
                        : "border-[#d9d3eb] bg-white text-[#30275b]",
                    )}
                  >
                    {index + 1}
                  </div>
                </div>
                <p
                  className={cn(
                    "text-[0.82rem] font-medium sm:mt-2.5 sm:text-center",
                    isActive ? "text-[#6b3ff0]" : "text-[#6c648d]",
                  )}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 rounded-[24px] border border-[#ebe5f8] bg-white/86 p-4 shadow-[0_12px_26px_rgba(60,45,110,0.05)] sm:p-5">
        <SectionHeading
          icon={FileText}
          title="Basic Details"
        />

        <div className="grid gap-3 xl:grid-cols-3">
          <div className="space-y-2 xl:col-span-3">
            <label className="text-[0.82rem] font-semibold text-[#2a2156]">Order Name</label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9087b1]" />
              <Input
                value={orderLabel}
                onChange={(event) => setOrderLabel(event.target.value)}
                placeholder="Enter order name"
                className="h-11 rounded-[14px] border-[#e8def7] bg-white pl-11 text-[0.92rem] text-[#30275d] shadow-none placeholder:text-[#aaa2c2] focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60"
              />
            </div>
          </div>

          <FieldSelect
            label="Image Quality"
            value={quality}
            options={qualityOptions}
            onChange={setQuality}
            icon={Diamond}
            iconClassName="text-[#7a6df4]"
          />
          <FieldSelect
            label="Personalization Model"
            value={personalizationModel}
            options={modelOptions}
            onChange={setPersonalizationModel}
            icon={Crown}
            iconClassName="text-[#d4942b]"
          />
          <FieldSelect
            label="Coloring Model"
            value={coloringModel}
            options={modelOptions}
            onChange={setColoringModel}
            icon={Sparkles}
            iconClassName="text-[#7044ee]"
          />
        </div>
      </section>

      <section className="mt-5">
        <SectionHeading
          icon={Upload}
          title="Upload Photos"
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {uploadSlots.map((slot) => {
            const asset = assetsBySlot[slot.key];

            return (
              <article
                key={slot.key}
                className={cn(
                  "rounded-[20px] border p-4 shadow-[0_10px_22px_rgba(74,53,141,0.04)]",
                  slot.cardClassName,
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[1rem] font-bold tracking-[-0.03em] text-[#241c53]">
                      {slot.label}
                    </h3>
                    <p className="mt-1 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-[#8d84aa]">
                      {asset?.source || "empty"}
                    </p>
                  </div>
                  <Info className="h-4 w-4 shrink-0 text-[#a39abe]" />
                </div>

                <div
                  className={cn(
                    "mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
                    slot.avatarClassName,
                  )}
                >
                  {asset?.previewUrl ? (
                    <img
                      src={resolveApiUrl(asset.previewUrl)}
                      alt={slot.label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (() => {
                      const placeholders: Record<string, string> = {
                        child1: kid1Img,
                        child2: kid2Img,
                        dog1: dog1Img,
                        dog2: dog2Img,
                      };

                      const placeholderSrc = placeholders[slot.key] || undefined;

                      return placeholderSrc ? (
                        <img src={placeholderSrc} alt={`${slot.label} placeholder`} className="h-full w-full object-cover opacity-95" />
                      ) : (
                        <FileImage className="h-8 w-8 text-[#9b90bf]" />
                      );
                    })()
                  )}
                </div>

                <p className="mt-4 truncate text-center text-[0.82rem] text-[#6d6490]">
                  {asset?.fileName || "No source image selected yet"}
                </p>

                <div className="mt-4 space-y-2">
                  <label className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#ccb7ff] bg-white/75 px-4 text-[0.9rem] font-medium text-[#6f43ee] shadow-none transition hover:bg-[#f6f0ff]">
                    <Upload className="h-4 w-4" />
                    {uploadingSlot === slot.key ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void handleLocalUpload(slot, file);
                        }
                      }}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-full rounded-[12px] border-[#e6def7] bg-white/92 text-[0.9rem] font-medium text-[#3c315f] shadow-none hover:bg-[#faf7ff]"
                    onClick={() => setSourceBrowserSlot(slot.key)}
                  >
                    <CloudUpload className="h-4 w-4 text-[#6f43ee]" />
                    From Drive
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-5">
        <SectionHeading
          icon={FileImage}
          title="Reference Pages"
        />

        {selectedReferencePages.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {selectedReferencePages.map((page, index) => (
              <article
                key={page.id}
                className={cn(
                  "relative aspect-[1.34] overflow-hidden rounded-[16px] border shadow-[0_8px_18px_rgba(72,51,140,0.06)]",
                  referenceCardStyles[index % referenceCardStyles.length],
                )}
              >
                <button
                  type="button"
                  onClick={() => removeReferencePage(page.id)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-[10px] bg-white/92 text-[#5f567f] shadow-sm transition hover:bg-white"
                  aria-label={`Remove ${page.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex h-full w-full items-center justify-center overflow-hidden">
                  <img
                    src={resolveApiUrl(page.previewUrl)}
                    alt={page.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(22,16,51,0.72)_100%)] px-3 py-2">
                  <p className="truncate text-[0.78rem] font-medium text-white">{page.name}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#d9cefb] bg-white/65 p-6 text-center text-[0.92rem] text-[#7d759e]">
            No reference pages selected yet.
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="mt-4 h-10 rounded-[14px] border-dashed border-[#ccb7ff] bg-white/72 px-6 text-[0.9rem] font-medium text-[#6f43ee] shadow-none hover:bg-[#f7f1ff]"
          onClick={() => setReferenceBrowserOpen(true)}
        >
          <Plus className="h-4 w-4" />
          {selectedReferencePages.length ? "Add More Pages" : "Browse & Select Pages"}
        </Button>
      </section>

      <section className="mt-5">
        <SectionHeading
          icon={NotebookPen}
          title="Correction Notes"
        />

        <div className="rounded-[20px] border border-[#ebe5f8] bg-white/86 p-4 shadow-[0_12px_24px_rgba(60,45,110,0.04)]">
          <Textarea
            value={redoNotes}
            onChange={(event) => setRedoNotes(event.target.value)}
            placeholder="Add any specific correction notes or instructions for the generation..."
            className="min-h-[96px] resize-none rounded-[16px] border-[#e8def7] bg-white px-4 py-3 text-[0.92rem] text-[#30275d] shadow-none placeholder:text-[#aaa2c2] focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60"
          />
          <div className="mt-2 text-right text-[0.82rem] text-[#8279a1]">
            {redoNotes.length}/1000
          </div>
        </div>
      </section>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => void submitRun()}
          disabled={!sourceAssets.length || !selectedReferencePages.length || isSubmitting}
          className="h-12 w-full max-w-[360px] rounded-full bg-[linear-gradient(90deg,#6c43ef_0%,#9a5fff_100%)] text-[1rem] font-bold text-white shadow-[0_14px_28px_rgba(120,79,244,0.28)] hover:opacity-95"
        >
          {isSubmitting ? "Submitting..." : "Create Run"}
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>

      <DriveFileBrowser
        open={Boolean(sourceBrowserSlot)}
        onOpenChange={(open) => {
          if (!open) {
            setSourceBrowserSlot(null);
          }
        }}
        endpoint="/api/assets/drive/browse"
        mode="single"
        title="Select a source asset from Google Drive"
        description="Pick an existing uploaded image instead of uploading a new one."
        onConfirm={(files) => {
          const file = files[0];
          if (file) {
            assignDriveAsset(file);
          }
        }}
      />

      <DriveFileBrowser
        open={referenceBrowserOpen}
        onOpenChange={setReferenceBrowserOpen}
        endpoint="/api/reference-pages/browse"
        mode="multi"
        title="Select reference pages"
        description="Choose one or more book illustration pages for this run."
        initialSelectedIds={selectedReferencePages.map((page) => page.id)}
        onConfirm={(files) => {
          setSelectedReferencePages(
            files.map((file) => ({
              id: file.id,
              name: file.name,
              previewUrl: file.previewUrl,
            })),
          );
          setReferenceBrowserOpen(false);
        }}
      />
    </AppShell>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: typeof FileText;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3 text-[#231951]">
      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d8c9fb] bg-[#f7f1ff] text-[#7044ee]">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-[1.35rem] font-bold tracking-[-0.03em]">{title}</h2>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon: typeof Diamond;
  iconClassName?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[0.82rem] font-semibold text-[#2a2156]">{label}</label>
      <div className="relative">
        <Icon className={cn("pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2", iconClassName)} />
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-11 w-full rounded-[14px] border-[#e8def7] bg-white pl-11 pr-4 text-[0.92rem] text-[#30275d] shadow-none focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-[14px] border-[#e8def7]">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
