export interface Flags {
  alt: string;
  png: string;
  svg: string;
}
export interface NativeName {
  common: string;
  official: string;
}

export interface Name {
  common: string;
  nativeName: { [key: string]: NativeName };
  official: string;
}

export interface RootObject {
  cca2: string;
  flags: Flags;
  name: Name;
}
