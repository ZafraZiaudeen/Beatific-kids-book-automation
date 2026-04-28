import dogOne from "@/assets/dog1.webp";
import dogTwo from "@/assets/dog2.webp";
import kidOne from "@/assets/kid-1.webp";
import kidTwo from "@/assets/kid-2.webp";
import sidebarImage from "@/assets/sidebar-image.webp";
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
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Folder,
  Layers3,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

type Batch = {
  id: string;
  name: string;
  date: string;
  pageCount: number;
  quality: string;
  thumbnail: string;
  imageClassName?: string;
};

type PageCard = {
  id: string;
  title: string;
  pageNumber: number;
  image: string;
  imageClassName?: string;
  frameClassName: string;
};

const batches: Batch[] = [
  {
    id: "sky-adventure",
    name: "Sky Adventure",
    date: "May 20, 2024 at 10:30 AM",
    pageCount: 12,
    quality: "High Quality",
    thumbnail: sidebarImage,
    imageClassName: "object-cover object-[38%_28%]",
  },
  {
    id: "garden-story",
    name: "Garden Story",
    date: "May 18, 2024",
    pageCount: 10,
    quality: "High Quality",
    thumbnail: dogTwo,
  },
  {
    id: "ocean-friends",
    name: "Ocean Friends",
    date: "May 15, 2024",
    pageCount: 8,
    quality: "High Quality",
    thumbnail: kidOne,
  },
  {
    id: "space-explorers",
    name: "Space Explorers",
    date: "May 12, 2024",
    pageCount: 14,
    quality: "High Quality",
    thumbnail: kidTwo,
  },
  {
    id: "bedtime-tales",
    name: "Bedtime Tales",
    date: "May 10, 2024",
    pageCount: 9,
    quality: "High Quality",
    thumbnail: dogOne,
  },
];

const pageCards: PageCard[] = [
  {
    id: "cover",
    title: "Cover",
    pageNumber: 1,
    image: sidebarImage,
    imageClassName: "object-cover object-[35%_28%]",
    frameClassName:
      "border-[#d5e6ff] bg-[radial-gradient(circle_at_top,#6ec5ff_0%,#4f92ff_36%,#2b56ce_100%)]",
  },
  {
    id: "big-dream",
    title: "The Big Dream",
    pageNumber: 2,
    image: kidOne,
    frameClassName:
      "border-[#f6dfb4] bg-[radial-gradient(circle_at_top,#ffd7a0_0%,#f6ab58_28%,#7b88e4_100%)]",
  },
  {
    id: "up-away",
    title: "Up, Up and Away!",
    pageNumber: 3,
    image: kidOne,
    frameClassName:
      "border-[#dbe6ff] bg-[radial-gradient(circle_at_top,#b4e8ff_0%,#83c6ff_42%,#4b85ec_100%)]",
  },
  {
    id: "through-clouds",
    title: "Through the Clouds",
    pageNumber: 4,
    image: dogTwo,
    frameClassName:
      "border-[#d6ddff] bg-[radial-gradient(circle_at_top,#e2f0ff_0%,#8cb8ff_42%,#3a63d6_100%)]",
  },
  {
    id: "forest-path",
    title: "Forest Path",
    pageNumber: 5,
    image: dogOne,
    frameClassName:
      "border-[#dfe8c4] bg-[radial-gradient(circle_at_top,#d9efbc_0%,#84be72_42%,#507242_100%)]",
  },
  {
    id: "new-friends",
    title: "New Friends",
    pageNumber: 6,
    image: kidTwo,
    frameClassName:
      "border-[#e5efcb] bg-[radial-gradient(circle_at_top,#dbf1bf_0%,#86c274_42%,#527548_100%)]",
  },
  {
    id: "mountain-view",
    title: "Mountain View",
    pageNumber: 7,
    image: sidebarImage,
    imageClassName: "object-cover object-[33%_50%]",
    frameClassName:
      "border-[#dbe6ff] bg-[radial-gradient(circle_at_top,#d1ecff_0%,#a4ccff_38%,#6a8de2_100%)]",
  },
  {
    id: "celebration",
    title: "Celebration",
    pageNumber: 8,
    image: kidTwo,
    frameClassName:
      "border-[#e2d6ff] bg-[radial-gradient(circle_at_top,#2f387f_0%,#5f4bb5_36%,#f281bb_100%)]",
  },
];

export default function Gallery() {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState("8");

  const currentBatch =
    batches.find((batch) => batch.id === selectedBatchId) ?? batches[0];

  const filteredPages = useMemo(() => {
    return pageCards.filter((page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8f2ff_0%,#fbfbff_42%,#fffdf7_100%)] p-2 sm:p-4 lg:p-5">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 lg:flex-row lg:gap-4">
        <Sidebar />

        <main className="min-w-0 flex-1 rounded-[28px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] p-4 shadow-[0_18px_56px_rgba(110,88,209,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
          <header>
            <h1 className="text-[2.25rem] font-extrabold tracking-[-0.04em] text-[#1d174b] sm:text-[2.9rem]">
              Gallery
            </h1>
            <p className="mt-1.5 text-[1rem] text-[#7b7399]">
              Browse and manage your generated children's books
            </p>
          </header>

          <section className="mt-6 overflow-hidden rounded-[26px] border border-[#ebe5f8] bg-white/86 shadow-[0_14px_32px_rgba(63,46,115,0.05)]">
            <div className="grid xl:grid-cols-[12.25rem_1fr]">
              <aside className="border-b border-[#efe9f8] p-4 xl:border-b-0 xl:border-r">
                <div className="space-y-2">
                  <button className="flex w-full items-center gap-3 rounded-[14px] bg-[#f6f2ff] px-4 py-3.5 text-left text-[0.92rem] font-semibold text-[#6d42ef]">
                    <Layers3 className="h-4 w-4" />
                    Batches
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[0.92rem] font-medium text-[#2f2856]">
                    <Folder className="h-4 w-4" />
                    Categories
                  </button>
                </div>

                <div className="mt-6 border-t border-[#efe9f8] pt-6">
                  <h2 className="text-[1.02rem] font-bold tracking-[-0.03em] text-[#241c53]">
                    Recent Batches
                  </h2>

                  <div className="mt-4 space-y-3">
                    {batches.map((batch) => {
                      const isSelected = batch.id === currentBatch.id;

                      return (
                        <button
                          key={batch.id}
                          onClick={() => setSelectedBatchId(batch.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-[16px] border px-3 py-3 text-left transition-all",
                            isSelected
                              ? "border-[#cbb8ff] bg-[#fbf8ff] shadow-[0_10px_20px_rgba(115,82,234,0.08)]"
                              : "border-[#ede7f8] bg-white hover:border-[#ddd2fb] hover:bg-[#fcfbff]"
                          )}
                        >
                          <div className="h-12 w-12 overflow-hidden rounded-[12px] border border-white/80 bg-[#edf2ff] shadow-sm">
                            <img
                              src={batch.thumbnail}
                              alt={batch.name}
                              className={cn(
                                "h-full w-full object-cover",
                                batch.imageClassName
                              )}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "truncate text-[0.95rem] font-semibold",
                                isSelected ? "text-[#6c43ef]" : "text-[#221c4f]"
                              )}
                            >
                              {batch.name}
                            </p>
                            <p className="mt-1 text-[0.78rem] text-[#7b7399]">
                              {batch.date} / {batch.pageCount} pages
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-7 h-10 w-full rounded-[14px] border-[#d8c8ff] bg-white/80 text-[0.9rem] font-medium text-[#6d42ef] shadow-none hover:bg-[#f7f1ff]"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    View All Batches
                  </Button>
                </div>
              </aside>

              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 border-b border-[#efe9f8] pb-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[14px] border border-white/80 bg-[#eef3ff] shadow-sm">
                      <img
                        src={currentBatch.thumbnail}
                        alt={currentBatch.name}
                        className={cn(
                          "h-full w-full object-cover",
                          currentBatch.imageClassName
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[1.85rem] font-bold tracking-[-0.04em] text-[#1f184d]">
                          {currentBatch.name}
                        </h2>
                        <Pencil className="h-4 w-4 text-[#8e86af]" />
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-[0.84rem] text-[#7b7399]">
                        <span>{currentBatch.date}</span>
                        <span>/</span>
                        <span>{currentBatch.pageCount} pages</span>
                        <span>/</span>
                        <span className="inline-flex items-center gap-1.5 text-[#796df4]">
                          <Sparkles className="h-4 w-4" />
                          {currentBatch.quality}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      variant="outline"
                      className="h-10 rounded-[12px] border-[#d8c8ff] bg-white/80 px-4 text-[0.9rem] font-medium text-[#6d42ef] shadow-none hover:bg-[#f7f1ff]"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Refresh
                    </Button>
                    <div className="relative min-w-0 flex-1 sm:w-[17rem]">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a29abb]" />
                      <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search pages..."
                        className="h-10 rounded-[12px] border-[#e8def7] bg-white pl-10 text-[0.9rem] text-[#30275d] shadow-none placeholder:text-[#aaa2c2] focus-visible:border-[#b89cff] focus-visible:ring-[#d8c6ff]/60"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="h-10 rounded-[12px] border-[#e8def7] bg-white/80 px-4 text-[0.9rem] font-medium text-[#40355f] shadow-none hover:bg-[#faf7ff]"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                  {filteredPages.map((page) => (
                    <article
                      key={page.id}
                      className="overflow-hidden rounded-[20px] border border-[#ebe5f8] bg-white shadow-[0_12px_24px_rgba(65,48,122,0.06)]"
                    >
                      <div
                        className={cn(
                          "relative aspect-[0.78] overflow-hidden border-b border-white/15",
                          page.frameClassName
                        )}
                      >
                        <img
                          src={page.image}
                          alt={page.title}
                          className={cn(
                            "h-full w-full object-cover",
                            page.imageClassName
                          )}
                        />
                      </div>

                      <div className="p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-[1rem] font-semibold tracking-[-0.03em] text-[#221c4f]">
                              {page.title}
                            </h3>
                            <p className="mt-1.5 text-[0.82rem] text-[#7b7399]">
                              Page {page.pageNumber}
                            </p>
                          </div>
                          <button className="mt-1 text-[#5f567f]">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <span className="rounded-[10px] bg-[#f2ebff] px-3 py-1 text-[0.76rem] font-medium text-[#7653ef]">
                            Personalized
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-[#efe9f8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center justify-center gap-3 sm:flex-1">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#6d638f] hover:bg-[#f5f1ff]">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#7a4df1_0%,#6b42eb_100%)] text-[0.82rem] font-semibold text-white shadow-[0_10px_18px_rgba(118,77,241,0.24)]">
                      1
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-[0.9rem] text-[#2d2554]">
                      2
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-[0.9rem] text-[#2d2554]">
                      3
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#6d638f] hover:bg-[#f5f1ff]">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <Select value={pageSize} onValueChange={setPageSize}>
                    <SelectTrigger className="h-10 w-full rounded-[12px] border-[#e8def7] bg-white px-4 text-[0.88rem] text-[#30275d] shadow-none sm:w-[8rem]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[14px] border-[#e8def7]">
                      <SelectItem value="8">8 per page</SelectItem>
                      <SelectItem value="12">12 per page</SelectItem>
                      <SelectItem value="16">16 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
