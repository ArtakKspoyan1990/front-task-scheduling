/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_PUSHER_APP_KEY: string
    readonly VITE_PUSHER_APP_CLUSTER: string
    readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
