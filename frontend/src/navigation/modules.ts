import modulesData from './modules.json';

export interface NavigationItem {
  title: string;
  route: string;
}

export interface ModuleConfig {
  id: string;
  name: string;
  route: string;
  navigation: NavigationItem[];
}

export interface AppManifest {
  application: string;
  basePath: string;
  landingPage: {
    title: string;
    route: string;
  };
  modules: ModuleConfig[];
}

export const navigationConfig: AppManifest = modulesData as AppManifest;
