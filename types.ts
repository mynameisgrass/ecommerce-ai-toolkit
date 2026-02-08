export enum Tab {
  IMAGE_PROCESSING = 'image_processing',
  VIDEO_PROMPT = 'video_prompt',
  SALES_SCRIPT = 'sales_script',
}

export enum ImageProcessType {
  CLOTHING = 'clothing',
  PRODUCT = 'product',
}

export enum VideoDuration {
  FIFTEEN_SEC = '15s',
  SIXTY_SEC = '60s',
}

export interface ProcessingResult {
  type: 'text' | 'image' | null;
  content: string; // URL for image, Text string for scripts
  timestamp: number;
}

export interface AppState {
  activeTab: Tab;
  isLoading: boolean;
  result: ProcessingResult | null;
  error: string | null;
}
