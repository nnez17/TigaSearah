const c = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	dim: "\x1b[2m",
	cyan: "\x1b[36m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	gray: "\x1b[90m",
};

const banner = `
${c.cyan}  _____ ___ ____    _      ____  _____    _    ____      _    _   _
${c.cyan} |_   _|_ _/ ___|  / \\    / ___|| ____|  / \\  |  _ \\    / \\  | | | |
${c.blue}   | |  | | |  _  / _ \\   \\___ \\|  _|   / _ \\ | |_) |  / _ \\ | |_| |
${c.blue}   | |  | | |_| |/ ___ \\   ___) | |___ / ___ \\|  _ <  / ___ \\|  _  |
${c.magenta}   |_| |___\\____/_/   \\_\\ |____/|_____/_/   \\_\\_| \\_\\/_/   \\_\\_| |_|${c.reset}
`;

console.log(banner);
console.log(`  ${c.bold}TIGA SEARAH STUDIO${c.reset} ${c.dim}— Dev Environment${c.reset}`);
console.log(`  ${c.gray}${"─".repeat(56)}${c.reset}`);
console.log(`  ${c.green}●${c.reset} ${c.bold}Web (Astro):${c.reset}    ${c.cyan}http://127.0.0.1:4321${c.reset}`);
console.log(`  ${c.yellow}●${c.reset} ${c.bold}API (Nitro):${c.reset}    ${c.cyan}http://127.0.0.1:3001${c.reset}`);
console.log(`  ${c.gray}${"─".repeat(56)}${c.reset}\n`);

const proc = Bun.spawn(["bun", "run", "turbo", "dev", ...process.argv.slice(2)], {
	stdio: ["inherit", "inherit", "inherit"],
});

process.on("SIGINT", () => {
	proc.kill(2);
	process.exit(0);
});

process.on("SIGTERM", () => {
	proc.kill(15);
	process.exit(0);
});

await proc.exited;
