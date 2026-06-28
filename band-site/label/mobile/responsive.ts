export type MobileCapabilityReport = {
  isMobile: boolean;
  canInstallPwa: boolean;
  canRecordAudio: boolean;
  canUploadCamera: boolean;
  offlineContractsEnabled: boolean;
};

export function getResponsiveClassName(width: number) {
  if (width < 640) return "label-mobile";
  if (width < 1024) return "label-tablet";
  return "label-desktop";
}

export function getPwaManifest() {
  return {
    name: "KAMDRIDI RECORDS",
    short_name: "KDR Records",
    start_url: "/label/artist",
    display: "standalone",
    background_color: "#050403",
    theme_color: "#f4c66a",
    icons: [
      { src: "/assets/images/kamdridi-app-logo-blue.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/images/kamdridi-app-logo-blue.png", sizes: "512x512", type: "image/png" }
    ]
  };
}

export function buildMobileCapabilityReport(userAgent: string): MobileCapabilityReport {
  const isMobile = /iphone|ipad|android|mobile/i.test(userAgent);
  return {
    isMobile,
    canInstallPwa: true,
    canRecordAudio: isMobile,
    canUploadCamera: isMobile,
    offlineContractsEnabled: true
  };
}
