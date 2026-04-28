import { useState } from "react";
import { Upload, Cloud, CheckCircle2, Sparkles } from "lucide-react";
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
import Sidebar from "@/components/Sidebar";

export default function NewBatchRun() {
  const [orderName, setOrderName] = useState("");
  const [imageQuality, setImageQuality] = useState("ultra-hd");
  const [personalizationModel, setPersonalizationModel] = useState("chatgpt-4");
  const [coloringModel, setColoringModel] = useState("flux-kortext");
  const [uploadedFiles, setUploadedFiles] = useState({
    kidOne: false,
    kidTwo: false,
    dogOne: false,
    dogTwo: false,
  });
  const [referencePages, setReferencePages] = useState(0);
  const [correctionNotes, setCorrectionNotes] = useState("");

  const handleFileUpload = (fileType: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fileType]: true,
    }));
  };

  const handleGenerateClick = () => {
    if (!orderName.trim()) {
      alert("Please enter an order name");
      return;
    }
    if (referencePages === 0) {
      alert("Please select at least one reference page");
      return;
    }
    alert("Starting generation with order: " + orderName);
  };

  const steps = [
    { number: 1, label: "Basic details" },
    { number: 2, label: "Upload Photos" },
    { number: 3, label: "Reference Pages" },
    { number: 4, label: "Correction Notes" },
    { number: 5, label: "Review & Generate" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              New batch run
            </h1>
            <p className="text-gray-600">
              Configure, upload photos, pick reference pages, then generate.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                        step.number === 1
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="text-xs font-medium text-gray-600 mt-2 text-center">
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                        step.number < 1 ? "bg-purple-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Basic Details Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basic details</h2>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Order name
                </label>
                <Input
                  placeholder="Enter order name"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Image quality
                  </label>
                  <Select value={imageQuality} onValueChange={setImageQuality}>
                    <SelectTrigger className="rounded-lg border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (1024x1024)
                      </SelectItem>
                      <SelectItem value="hd">HD (2048x1536)</SelectItem>
                      <SelectItem value="ultra-hd">
                        Ultra HD (2048x1536) - Best
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Personalization model
                  </label>
                  <Select
                    value={personalizationModel}
                    onValueChange={setPersonalizationModel}
                  >
                    <SelectTrigger className="rounded-lg border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chatgpt-3">
                        ChatGPT 3 (Good Quality)
                      </SelectItem>
                      <SelectItem value="chatgpt-4">
                        ChatGPT 4 (Best Quality)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Coloring model
                </label>
                <Select value={coloringModel} onValueChange={setColoringModel}>
                  <SelectTrigger className="rounded-lg border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flux-kortext">
                      Flux Kortext Pro (Recommended)
                    </SelectItem>
                    <SelectItem value="stable-diffusion">
                      Stable Diffusion
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Upload Photos Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <h2 className="text-xl font-bold text-gray-900">Upload photos</h2>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Add kid and dog reference photos from your device or Google Drive.
            </p>

            <div className="grid grid-cols-4 gap-6">
              {[
                { key: "kidOne", label: "Kid one", required: true },
                { key: "kidTwo", label: "Kid two", required: false },
                { key: "dogOne", label: "Dog one", required: true },
                { key: "dogTwo", label: "Dog two", required: false },
              ].map((item) => (
                <div
                  key={item.key}
                  className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    {item.required ? "Required" : "Optional"}
                  </p>

                  {uploadedFiles[item.key as keyof typeof uploadedFiles] ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                      Uploaded
                    </div>
                  ) : (
                    <div className="space-y-2 mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-lg"
                        onClick={() =>
                          handleFileUpload(item.key as keyof typeof uploadedFiles)
                        }
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full rounded-lg"
                      >
                        <Cloud className="w-4 h-4 mr-1" />
                        From Drive
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Reference Pages Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <h2 className="text-xl font-bold text-gray-900">Reference pages</h2>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 text-sm mb-4">
                Select which book pages to generate in this run.
              </p>
              <Button
                variant="outline"
                className="rounded-lg border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                Browse & select pages
              </Button>
              {referencePages === 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  No pages selected — Click "Browse & select pages" above
                </p>
              )}
            </div>
          </section>

          {/* Correction Notes Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <h2 className="text-xl font-bold text-gray-900">Correction notes</h2>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 text-sm mb-4">
                Optional notes for the AI about specific adjustments.
              </p>
              <Textarea
                placeholder="e.g. Make the dog look more fluffy, adjust kid's hair color..."
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                className="rounded-lg border-gray-300 min-h-24"
              />
              <p className="text-xs text-gray-500 mt-2">
                {correctionNotes.length}/1000
              </p>
            </div>
          </section>

          {/* Generate Button */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleGenerateClick}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl py-6 text-base font-semibold shadow-lg shadow-purple-200"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate selected pages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
