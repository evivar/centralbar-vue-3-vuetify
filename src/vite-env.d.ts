/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// API Key Here Maps: JNxY3zutNlfpt58LXnMWYgRwZoAGn5HWs2h9YoKOdeQ