/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GCLOUD_URL: string;
  readonly VITE_WORKER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
