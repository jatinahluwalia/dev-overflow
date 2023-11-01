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
  name: Name;
}
