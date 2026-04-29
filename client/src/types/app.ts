export type AppRole = "admin" | "member";

export type AppUser = {
  userId: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: AppRole;
};

export type SourceAsset = {
  slot: "child1" | "child2" | "dog1" | "dog2";
  label: string;
  fileName: string;
  driveFileId: string;
  mimeType?: string;
  previewUrl?: string;
  source: "upload" | "drive";
};

export type ReferencePage = {
  id: string;
  name: string;
  previewUrl: string;
};

export type DriveBrowserFile = {
  id: string;
  name: string;
  mimeType: string;
  previewUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DriveBrowserFolder = {
  id: string;
  name: string;
};

export type DriveBrowserResponse = {
  folderId: string;
  folders: DriveBrowserFolder[];
  files: DriveBrowserFile[];
};

export type RunPageVariant = {
  driveFileId: string;
  fileName: string;
  previewPath: string;
  createdAt: string;
};

export type RunPage = {
  pageKey: string;
  referencePageId: string;
  referencePageName: string;
  generationStatus: "pending" | "generated" | "failed" | "partial_failed";
  personalized?: RunPageVariant;
  coloring?: RunPageVariant;
  upscaledPersonalized?: RunPageVariant;
  upscaledColoring?: RunPageVariant;
  upscaleStatus:
    | "not_requested"
    | "pending"
    | "completed"
    | "failed"
    | "partial_failed";
  errorMessage?: string;
};

export type BatchRun = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  orderLabel: string;
  quality: string;
  personalizationModel: string;
  coloringModel: string;
  redoNotes: string;
  sourceAssets: SourceAsset[];
  referencePages: ReferencePage[];
  status:
    | "queued"
    | "processing"
    | "review_ready"
    | "upscaling"
    | "completed"
    | "failed"
    | "partial_failed";
  n8nRunId: string | null;
  driveOutputFolderId: string;
  driveOutputFolderName: string;
  pages: RunPage[];
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number | null;
};

export type TeamInvitation = {
  id: string;
  emailAddress: string;
  status: string;
  createdAt: number;
  expiresAt: number | null;
};
