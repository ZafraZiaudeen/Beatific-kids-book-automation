import dogOne from "@/assets/dog1.webp";
import dogTwo from "@/assets/dog2.webp";
import kidOne from "@/assets/kid-1.webp";
import kidTwo from "@/assets/kid-2.webp";
import Sidebar from "@/components/Sidebar";
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
import { cn } from "@/lib/utils";
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
import { useState } from "react";

const steps = [
  "Basic Details",
  "Upload Photos",
  "Reference Pages",
  "Correction Notes",
  "Review & Generate",
];

const uploadCards = [
  {
    id: "kid-one",
    label: "Kid One",
    image: kidOne,
    cardClassName:
      "border-[#d9e8ff] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#edf5ff_0%,#ffffff_100%)]",
  },
  {
    id: "kid-two",
    label: "Kid Two",
    image: kidTwo,
    cardClassName:
      "border-[#f5d8eb] bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#fff0f7_0%,#ffffff_100%)]",
  },
  {
    id: "dog-one",
    label: "Dog One",
    image: dogOne,
    cardClassName:
      "border-[#f9e6c7] bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#fff5df_0%,#ffffff_100%)]",
  },
  {
    id: "dog-two",
    label: "Dog Two",
    image: dogTwo,
    cardClassName:
      "border-[#d8f0e5] bg-[linear-gradient(180deg,#f5fffb_0%,#ffffff_100%)]",
    avatarClassName: "bg-[linear-gradient(180deg,#ebfaf3_0%,#ffffff_100%)]",
  },
];

const referencePages = [
  {
    id: "page-1",
    image: kidOne,
    className:
      "border-[#dbe7ff] bg-[radial-gradient(circle_at_top,#d3ebff_0%,#91bfff_42%,#76a0f2_100%)]",
    imageClassName: "h-[88%] w-auto object-contain object-bottom",
  },
  {
    id: "page-2",
    image: dogOne,
    className:
      "border-[#f6e2ba] bg-[radial-gradient(circle_at_top,#fde8b5_0%,#fac06c_35%,#86b9ee_100%)]",
    imageClassName: "h-[88%] w-auto object-contain object-bottom",
  },
  {
    id: "page-3",
    image: kidTwo,
    className:
      "border-[#d9d7ff] bg-[radial-gradient(circle_at_top,#313785_0%,#5860b7_38%,#92a6ff_100%)]",
    imageClassName: "h-[90%] w-auto object-contain object-bottom",
  },
  {
    id: "page-4",
    image: dogTwo,
    className:
      "border-[#ddeaff] bg-[radial-gradient(circle_at_top,#d0f0ff_0%,#8dd3ff_38%,#78b2ff_100%)]",
    imageClassName: "h-[88%] w-auto object-contain object-bottom",
  },
  {
    id: "page-5",
    image: kidOne,
    className:
      "border-[#e9e1c5] bg-[radial-gradient(circle_at_top,#dff0c9_0%,#9bc37e_45%,#577547_100%)]",
    imageClassName: "h-[88%] w-auto object-contain object-bottom",
  },
  {
    id: "page-6",
    image: kidTwo,
    className:
      "border-[#f3d8df] bg-[radial-gradient(circle_at_top,#ffeff5_0%,#f3c0d5_40%,#aa73c8_100%)]",
    imageClassName: "h-[88%] w-auto object-contain object-bottom",
  },
];

export default function NewBatchRun() {
  const [orderName, setOrderName] = useState("");
  const [imageQuality, setImageQuality] = useState("high");
  const [modelSelection, setModelSelection] = useState("premium");
  const [correctionNotes, setCorrectionNotes] = useState("");

  const handleGenerateClick = () => {
    if (!orderName.trim()) {
      window.alert("Please enter an order name before generating.");
      return;
    }

    window.alert(`Generating pages for "${orderName}".`);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8f2ff_0%,#fbfbff_42%,#fffdf7_100%)] p-2 sm:p-4 lg:p-5">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 lg:flex-row lg:gap-4">
        <Sidebar />

        <main className="min-w-0 flex-1 rounded-[28px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] p-4 shadow-[0_18px_56px_rgba(110,88,209,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
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
                            : "border-[#d9d3eb] bg-white text-[#30275b]"
                        )}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-[0.82rem] font-medium sm:mt-2.5 sm:text-center",
                        isActive ? "text-[#6b3ff0]" : "text-[#6c648d]"
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
            <div className="mb-4 flex items-center gap-3 text-[#231951]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d8c9fb] bg-[#f7f1ff] text-[#7044ee]">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-[1.35rem] font-bold tracking-[-0.03em]">
                Basic Details
              </h2>
            </div>

            <div className="grid gap-3 xl:grid-cols-3">
              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-[#2a2156]">
                  Order Name
                </label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9087b1]" />
                  <Input
                    value={orderName}
                    onChange={(event) => setOrderName(event.target.value)}
                    placeholder="Enter order name"
                    className="h-11 rounded-[14px] border-[#e8def7] bg-white pl-11 text-[0.92rem] text-[#30275d] shadow-none placeholder:text-[#aaa2c2] focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-[#2a2156]">
                  Image Quality
                </label>
                <div className="relative">
                  <Diamond className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a6df4]" />
                  <Select value={imageQuality} onValueChange={setImageQuality}>
                    <SelectTrigger className="h-11 w-full rounded-[14px] border-[#e8def7] bg-white pl-11 pr-4 text-[0.92rem] text-[#30275d] shadow-none focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[14px] border-[#e8def7]">
                      <SelectItem value="high">High (Recommended)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.82rem] font-semibold text-[#2a2156]">
                  Model Selection
                </label>
                <div className="relative">
                  <Crown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4942b]" />
                  <Select
                    value={modelSelection}
                    onValueChange={setModelSelection}
                  >
                    <SelectTrigger className="h-11 w-full rounded-[14px] border-[#e8def7] bg-white pl-11 pr-4 text-[0.92rem] text-[#30275d] shadow-none focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[14px] border-[#e8def7]">
                      <SelectItem value="premium">
                        Premium (Best Quality)
                      </SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="fast">Fast Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-4 flex items-center gap-3 text-[#231951]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d8c9fb] bg-[#f7f1ff] text-[#7044ee]">
                <Upload className="h-4 w-4" />
              </div>
              <h2 className="text-[1.35rem] font-bold tracking-[-0.03em]">
                Upload Photos
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {uploadCards.map((card) => (
                <article
                  key={card.id}
                  className={cn(
                    "rounded-[20px] border p-4 shadow-[0_10px_22px_rgba(74,53,141,0.04)]",
                    card.cardClassName
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-center text-[1rem] font-bold tracking-[-0.03em] text-[#241c53]">
                      {card.label}
                    </h3>
                    <Info className="h-4 w-4 text-[#a39abe]" />
                  </div>

                  <div
                    className={cn(
                      "mx-auto flex h-28 w-28 items-end justify-center overflow-hidden rounded-full",
                      card.avatarClassName
                    )}
                  >
                    <img
                      src={card.image}
                      alt={card.label}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="h-10 w-full rounded-[12px] border-dashed border-[#ccb7ff] bg-white/75 text-[0.9rem] font-medium text-[#6f43ee] shadow-none hover:bg-[#f6f0ff]"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 w-full rounded-[12px] border-[#e6def7] bg-white/92 text-[0.9rem] font-medium text-[#3c315f] shadow-none hover:bg-[#faf7ff]"
                    >
                      <CloudUpload className="h-4 w-4 text-[#6f43ee]" />
                      From Drive
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-4 flex items-center gap-3 text-[#231951]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d8c9fb] bg-[#f7f1ff] text-[#7044ee]">
                <FileImage className="h-4 w-4" />
              </div>
              <h2 className="text-[1.35rem] font-bold tracking-[-0.03em]">
                Reference Pages
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              {referencePages.map((page) => (
                <article
                  key={page.id}
                  className={cn(
                    "relative aspect-[1.34] overflow-hidden rounded-[16px] border shadow-[0_8px_18px_rgba(72,51,140,0.06)]",
                    page.className
                  )}
                >
                  <button className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-[10px] bg-white/92 text-[#5f567f] shadow-sm">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center">
                    <img
                      src={page.image}
                      alt="Reference page preview"
                      className={page.imageClassName}
                    />
                  </div>
                </article>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-4 h-10 rounded-[14px] border-dashed border-[#ccb7ff] bg-white/72 px-6 text-[0.9rem] font-medium text-[#6f43ee] shadow-none hover:bg-[#f7f1ff]"
            >
              <Plus className="h-4 w-4" />
              Add More Pages
            </Button>
          </section>

          <section className="mt-5">
            <div className="mb-4 flex items-center gap-3 text-[#231951]">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d8c9fb] bg-[#f7f1ff] text-[#7044ee]">
                <NotebookPen className="h-4 w-4" />
              </div>
              <h2 className="text-[1.35rem] font-bold tracking-[-0.03em]">
                Correction Notes
              </h2>
            </div>

            <div className="rounded-[20px] border border-[#ebe5f8] bg-white/86 p-4 shadow-[0_12px_24px_rgba(60,45,110,0.04)]">
              <Textarea
                value={correctionNotes}
                onChange={(event) => setCorrectionNotes(event.target.value)}
                placeholder="Add any specific correction notes or instructions for the generation..."
                className="min-h-[96px] resize-none rounded-[16px] border-[#e8def7] bg-white px-4 py-3 text-[0.92rem] text-[#30275d] shadow-none placeholder:text-[#aaa2c2] focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60"
              />
              <div className="mt-2 text-right text-[0.82rem] text-[#8279a1]">
                {correctionNotes.length}/1000
              </div>
            </div>
          </section>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleGenerateClick}
              className="h-12 w-full max-w-[360px] rounded-full bg-[linear-gradient(90deg,#6c43ef_0%,#9a5fff_100%)] text-[1rem] font-bold text-white shadow-[0_14px_28px_rgba(120,79,244,0.28)] hover:opacity-95"
            >
              Generate
              <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
