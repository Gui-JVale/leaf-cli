interface Store {
  domain: string;
  themes: {
    [key: string]: number;
  };
}

export interface Config {
  store?: Store;
  stores?: { [key: string]: Store };
  build: {
    js: {
      sources: string[];
      typescript: boolean;
    };
  };
}
