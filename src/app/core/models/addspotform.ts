export interface SpotSubTag {
  id: number;
  name: string;
}

export interface SpotTagItem {
  id: number;
  name: string;
  spotSubTags: SpotSubTag[];
}

export interface SpotTagResponse {
  data: {
    items: SpotTagItem[];
    currentPage: number;
    total: number;
    totalPages: number;
  };
  message: string;
  code: number;
}

export interface SpotSubCategory {
  id: number;
  name: string;
}

export interface SpotItem {
  name: string;
  spotSubCategories: SpotSubCategory[];
}

export interface SpotData {
  items: SpotItem[];
  currentPage: number;
  total: number;
  totalPages: number;
}

export interface SpotResponse {
  data: SpotData;
  message: string;
  code: number;
}
export interface SpotBusinessConfigResponse {
  data: SpotBusinessConfigItem[];
  message: string;
  code: number;
}

export interface SpotBusinessConfigItem {
  id: number;
  key: string;
  value: string;
  hasOptions: boolean;
  defaultOptions: string[];
}

export interface SpotBusinessConfigCheckBoxData {
  id: number;
  label: string;
  value: string;
  options: string[];
}
