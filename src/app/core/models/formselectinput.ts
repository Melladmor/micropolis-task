export interface SelectOption {
  label: string;
  value: string;
  children?: SelectOption[];
}

export interface SelectGroup {
  groupLabel: string;
  id?: number | string;
  options: SelectOption[];
  collapsed?: boolean;
}
