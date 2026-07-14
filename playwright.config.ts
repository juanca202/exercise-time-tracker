import { defineConfig, devices } from "@playwright/test";

// Dedicated, uncommon port to avoid colliding with other local dev servers.
const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Un único worker: los TC-013/TC-014 de rendimiento (AC-005) miden tiempos
  // de navegación con umbrales absolutos (<2000 ms); ejecutar specs en
  // paralelo introduce contención de CPU entre workers que hace la medición
  // no determinística sin reflejar una regresión real de la aplicación.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { PORT: String(PORT) },
  },
});
