export function createStepManager(container) {
	const steps = [];
	const context = {};
	let titleEl = null;
	let stepContainer = null;

	function addStep(fn) {
		steps.push(fn);
	}

	const TITLE_COLORS = [
		"var(--color-flames-f)",
		"var(--color-flames-l)",
		"var(--color-flames-a)",
		"var(--color-flames-m)",
		"var(--color-flames-e)",
		"var(--color-flames-s)",
	];

	function ensureStructure() {
		if (!titleEl) {
			titleEl = document.createElement("h1");
			titleEl.className = "app-title";
			"FLAMES".split("").forEach((ch, i) => {
				const span = document.createElement("span");
				span.textContent = ch;
				span.style.color = TITLE_COLORS[i];
				titleEl.appendChild(span);
				if (i < 5) {
					const dot = document.createElement("span");
					dot.textContent = ".";
					dot.className = "app-title-dot";
					titleEl.appendChild(dot);
				}
			});
			container.appendChild(titleEl);
		}
		if (!stepContainer) {
			stepContainer = document.createElement("div");
			stepContainer.className = "step-container";
			container.appendChild(stepContainer);
		}
	}

	async function runStep(index) {
		container.classList.remove("step-visible");

		await new Promise((r) => setTimeout(r, 400));
		ensureStructure();
		stepContainer.innerHTML = "";

		steps[index](stepContainer, context, (updates) => {
			if (updates) Object.assign(context, updates);

			if (index + 1 < steps.length) {
				runStep(index + 1);
			} else {
				restart();
			}
		});

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				container.classList.add("step-visible");
			});
		});
	}

	function start() {
		runStep(0);
	}

	function restart() {
		Object.keys(context).forEach((k) => delete context[k]);
		runStep(0);
	}

	return { addStep, start, restart };
}
