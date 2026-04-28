import { useState } from "react";
import { RefreshCw, Search, Filter, MoreVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";

interface Batch {
  id: string;
  name: string;
  date: string;
  pageCount: number;
  quality: string;
  thumbnail: string;
}

interface Page {
  id: string;
  title: string;
  pageNumber: number;
  status: "Personalized";
  image: string;
}

export default function Gallery() {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const batches: Batch[] = [
    {
      id: "1",
      name: "Sky Adventure",
      date: "May 20, 2024 at 10:30 AM",
      pageCount: 12,
      quality: "High Quality",
      thumbnail:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop",
    },
    {
      id: "2",
      name: "Garden Story",
      date: "May 18, 2024",
      pageCount: 10,
      quality: "High Quality",
      thumbnail:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop",
    },
    {
      id: "3",
      name: "Ocean Friends",
      date: "May 15, 2024",
      pageCount: 8,
      quality: "High Quality",
      thumbnail:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
    },
    {
      id: "4",
      name: "Space Explorers",
      date: "May 12, 2024",
      pageCount: 14,
      quality: "High Quality",
      thumbnail:
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=100&h=100&fit=crop",
    },
    {
      id: "5",
      name: "Bedtime Tales",
      date: "May 10, 2024",
      pageCount: 9,
      quality: "High Quality",
      thumbnail:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop",
    },
  ];

  const pages: Page[] = [
    {
      id: "1",
      title: "Cover",
      pageNumber: 1,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=400&fit=crop",
    },
    {
      id: "2",
      title: "The Big Dream",
      pageNumber: 2,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=400&fit=crop",
    },
    {
      id: "3",
      title: "Up, Up and Away!",
      pageNumber: 3,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
    },
    {
      id: "4",
      title: "Through the Clouds",
      pageNumber: 4,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=400&fit=crop",
    },
    {
      id: "5",
      title: "Forest Path",
      pageNumber: 5,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=400&fit=crop",
    },
    {
      id: "6",
      title: "New Friends",
      pageNumber: 6,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=400&fit=crop",
    },
    {
      id: "7",
      title: "Mountain View",
      pageNumber: 7,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
    },
    {
      id: "8",
      title: "Celebration",
      pageNumber: 8,
      status: "Personalized",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=400&fit=crop",
    },
  ];

  const currentBatch = selectedBatch || batches[0];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
            <p className="text-gray-600">
              Browse and manage your generated children's books
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-4 gap-8">
            {/* Left Sidebar - Batches & Categories */}
            <div className="col-span-1">
              {/* Batches Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Batches</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:bg-purple-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {batches.map((batch) => (
                    <button
                      key={batch.id}
                      onClick={() => setSelectedBatch(batch)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                        currentBatch?.id === batch.id
                          ? "bg-purple-100 border border-purple-300"
                          : "hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      <img
                        src={batch.thumbnail}
                        alt={batch.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {batch.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {batch.date} • {batch.pageCount} pages
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 rounded-lg border-gray-300"
                >
                  View All Batches
                </Button>
              </div>

              {/* Categories Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Categories</h2>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                    Personalized
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700">
                    Coloring
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Pages Grid */}
            <div className="col-span-3">
              {/* Header with Search and Filter */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-lg border-gray-300"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-lg border-gray-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Batch Title */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={currentBatch.thumbnail}
                    alt={currentBatch.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentBatch.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {currentBatch.date} • {currentBatch.pageCount} pages •{" "}
                      <span className="text-purple-600 font-medium">
                        {currentBatch.quality}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-2 gap-6">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all group"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gray-100 h-64">
                      <img
                        src={page.image}
                        alt={page.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {page.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Page {page.pageNumber}
                        </span>
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          {page.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <span className="text-sm text-gray-600">8 per page</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    ←
                  </Button>
                  <Button
                    size="sm"
                    className="bg-purple-600 text-white rounded-lg"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
