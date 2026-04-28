import { BookOpen, Plus, Image, LogOut, User } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  return (
    <div className="w-64 bg-gradient-to-b from-purple-50 to-white border-r border-purple-100 flex flex-col min-h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-purple-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">Kids Book</h1>
            <p className="text-xs text-purple-600 font-medium">Automation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* New Batch Run */}
        <button
          onClick={() => setLocation("/")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            location === "/"
              ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-200"
              : "text-gray-700 hover:bg-purple-100"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium text-sm">New batch run</span>
        </button>

        {/* Gallery */}
        <button
          onClick={() => setLocation("/gallery")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            location === "/gallery"
              ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-200"
              : "text-gray-700 hover:bg-purple-100"
          }`}
        >
          <Image className="w-5 h-5" />
          <span className="font-medium text-sm">Gallery</span>
        </button>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-purple-100 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-100">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-600 truncate">admin@example.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-purple-100"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
}
