export function setupThemeToggle() {
	function getCurrentTheme(): "light" | "dark" {
		return document.documentElement.classList.contains("light-theme")
			? "light"
			: "dark";
	}

	async function toggleTheme(event: Event) {
		const current = getCurrentTheme();
		const nextTheme = current === "light" ? "dark" : "light";

		// Target coordinates from click or center of button/window
		const target = (event.currentTarget as HTMLElement) || event.target;
		const rect =
			target instanceof HTMLElement
				? target.getBoundingClientRect()
				: {
						left: window.innerWidth / 2,
						top: window.innerHeight / 2,
						width: 0,
						height: 0,
					};

		const mouseEvent = event instanceof MouseEvent ? event : undefined;
		const x = mouseEvent?.clientX || rect.left + rect.width / 2;
		const y = mouseEvent?.clientY || rect.top + rect.height / 2;

		// Dispatch custom event so the 3D Trisula scene reacts kinetically
		window.dispatchEvent(
			new CustomEvent("theme-change", {
				detail: { theme: nextTheme, x, y },
			}),
		);

		const applyTheme = () => {
			document.documentElement.classList.toggle(
				"light-theme",
				nextTheme === "light",
			);
			try {
				localStorage.setItem("theme", nextTheme);
			} catch (_) {}

			const metaTheme = document.querySelector('meta[name="theme-color"]');
			if (metaTheme) {
				metaTheme.setAttribute(
					"content",
					nextTheme === "light" ? "#f8fafc" : "#111318",
				);
			}

			// Update ARIA labels
			document.querySelectorAll(".theme-toggle").forEach((btn) => {
				btn.setAttribute(
					"aria-label",
					nextTheme === "light"
						? "Ganti ke mode gelap"
						: "Ganti ke mode terang",
				);
				btn.setAttribute(
					"title",
					nextTheme === "light"
						? "Ganti ke mode gelap"
						: "Ganti ke mode terang",
				);
			});
		};

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const canViewTransition =
			"startViewTransition" in document &&
			window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

		if (!canViewTransition || prefersReducedMotion) {
			applyTheme();
			return;
		}

		// ElysiaJS rapid toggle acceleration
		try {
			const lastSwitch = window.localStorage.getItem("theme-switch");
			if (lastSwitch !== null && !isNaN(+lastSwitch)) {
				const elapsed = Date.now() - +lastSwitch;
				if (elapsed > 180 * 1000) {
					document.documentElement.classList.remove("-animated");
				} else {
					document.documentElement.classList.add("-animated");
				}
			}
			window.localStorage.setItem("theme-switch", Date.now().toString());
		} catch (_) {}

		try {
			const transition = document.startViewTransition(() => {
				applyTheme();
			});
			await transition.ready;
		} catch (_) {
			applyTheme();
		}
	}

	const buttons = document.querySelectorAll<HTMLElement>(
		".theme-toggle, [data-theme-toggle]",
	);
	buttons.forEach((button) => {
		button.addEventListener("click", toggleTheme);
	});
}

// Automatically initialize if in browser
if (typeof window !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => setupThemeToggle());
	} else {
		setupThemeToggle();
	}
}
