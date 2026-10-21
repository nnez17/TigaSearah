import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	retries: 0,
	workers: 2,
	reporter: "list",
	use: {
		baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:4321",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "desktop-chrome",
			use: {
				...devices["Desktop Chrome"],
				channel: "chrome",
				viewport: { width: 1440, height: 960 },
				launchOptions: { args: ["--enable-unsafe-swiftshader"] },
			},
		},
		{
			name: "mobile-chrome",
			use: {
				...devices["Pixel 7"],
				channel: "chrome",
				launchOptions: { args: ["--enable-unsafe-swiftshader"] },
			},
		},
		{
			name: "desktop-edge",
			use: {
				...devices["Desktop Edge"],
				channel: "msedge",
				launchOptions: { args: ["--enable-unsafe-swiftshader"] },
			},
		},
	],
	webServer: process.env.TEST_BASE_URL
		? undefined
		: {
				command: `"${process.env.npm_execpath || "bun"}" run dev`,
				url: "http://127.0.0.1:4321",
				reuseExistingServer: !process.env.CI,
				timeout: 60000,
			},
});
