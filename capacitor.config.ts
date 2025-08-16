import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cineschedule.app',
  appName: 'CineSchedule',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
