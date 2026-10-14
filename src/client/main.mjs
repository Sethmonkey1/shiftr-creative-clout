import { site } from "../data/site.mjs";
import { projects } from "../data/reference.mjs";
import { packages, calculatePrice } from "../data/pricing.mjs";

// Accessible shared tab behavior: arrow keys, Home, End, and focus follow selection.
document.querySelectorAll("[role=tablist]").forEach((list) => {
  const tabs = [...list.querySelectorAll("[role=tab]")];
  function select(tab) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(tabs[next]);
        tabs[next].focus();
      }
    });
  });
});

document.querySelectorAll("[data-plan]").forEach((card) => {
  const plan = packages.find((p) => p.id === card.dataset.plan);
  let duration = plan.seconds;
  card.querySelectorAll("[data-duration]").forEach((button) =>
    button.addEventListener("click", () => {
      const result = calculatePrice(
        plan,
        duration + Number(button.dataset.duration),
      );
      duration = result.seconds;
      card.querySelector("[data-price]").textContent = new Intl.NumberFormat(
        "en-US",
        { style: "currency", currency: "USD", maximumFractionDigits: 0 },
      ).format(result.price);
      card.querySelector("[data-duration-output]").textContent =
        `Up to ${duration} seconds`;
      card.querySelector('[data-duration="-30"]').disabled =
        duration <= plan.seconds;
      card.querySelector('[data-duration="30"]').disabled =
        duration >= plan.max;
    }),
  );
});

let previousFocus;
function openModal(dialog) {
  previousFocus = document.activeElement;
  dialog.showModal();
  syncMedia();
}
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelectorAll("[data-close]")
    .forEach((button) =>
      button.addEventListener("click", () => dialog.close()),
    );
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    previousFocus?.focus();
    syncMedia();
  });
});

let hls;
const projectDialog = document.getElementById("project-dialog");
const player = document.getElementById("project-player");
function clearPlayer() {
  hls?.destroy();
  hls = undefined;
  player.querySelector("video")?.pause();
  player.replaceChildren();
}
async function openProject(project) {
  clearPlayer();
  document.getElementById("project-title").textContent = project.name;
  document.getElementById("project-source").href =
    project.source || site.referenceUrl;
  openModal(projectDialog);
  if (project.video) {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.poster = project.image;
    video.preload = "metadata";
    video.setAttribute("aria-label", `${project.name} reference video`);
    player.append(video);
    if (
      !project.video.endsWith(".m3u8") ||
      video.canPlayType("application/vnd.apple.mpegurl")
    )
      video.src = project.video;
    else {
      try {
        await import("/assets/vendor/hls.min.js");
        if (!projectDialog.open || !video.isConnected) return;
        if (window.Hls?.isSupported()) {
          hls = new window.Hls({ enableWorker: false });
          hls.loadSource(project.video);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, (_, data) => {
            if (data.fatal) showPlaybackFallback(project);
          });
        } else showPlaybackFallback(project);
      } catch {
        showPlaybackFallback(project);
      }
    }
    video.addEventListener("error", () => showPlaybackFallback(project), {
      once: true,
    });
  } else showPlaybackFallback(project);
}
function showPlaybackFallback(project) {
  if (!projectDialog.open) return;
  hls?.destroy();
  hls = undefined;
  const img = document.createElement("img");
  img.src = project.image;
  img.alt = `${project.name} reference still`;
  player.replaceChildren(img);
  document.getElementById("project-source").textContent =
    "Open the original collection to watch";
}
document.querySelectorAll("[data-project]").forEach((button) =>
  button.addEventListener("click", () => {
    document.getElementById("project-source").textContent =
      "View original reference";
    const project = button.hasAttribute("data-showreel")
      ? {
          name: "Creative Clout showreel",
          image: "/assets/display/showreel.webp",
          video: "/assets/reference/showreel.mp4",
          source: site.referenceUrl,
        }
      : projects[Number(button.dataset.project)];
    openProject(project);
  }),
);
projectDialog.addEventListener("close", clearPlayer);

const bookingDialog = document.getElementById("booking-dialog");
const form = document.getElementById("booking-form");
const dates = document.getElementById("date-options");
const status = document.getElementById("booking-status");
const clearRequest = document.getElementById("clear-request");
const storageKey = "shiftr-landing-study:call-request";
const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
document.getElementById("timezone-label").textContent =
  `Times shown in ${zone.replaceAll("_", " ")}. Preview availability only.`;
function renderDates() {
  dates.replaceChildren();
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(12, 0, 0, 0);
    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "date";
    input.value = value;
    input.checked = i === 1;
    input.required = true;
    const span = document.createElement("span");
    const day = document.createElement("span");
    day.textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(date);
    const number = document.createElement("strong");
    number.textContent = date.getDate();
    const month = document.createElement("span");
    month.textContent = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    span.append(day, number, month);
    label.append(input, span);
    dates.append(label);
  }
}
document.querySelectorAll("[data-book]").forEach((button) =>
  button.addEventListener("click", () => {
    if (site.bookingUrl) {
      window.open(site.bookingUrl, "_blank", "noopener,noreferrer");
      return;
    }
    renderDates();
    status.textContent = "";
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved) {
        form.elements.name.value = saved.name || "";
        form.elements.email.value = saved.email || "";
        form.elements.message.value = saved.message || "";
        clearRequest.hidden = false;
      }
    } catch {}
    openModal(bookingDialog);
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const request = Object.fromEntries(new FormData(form));
  request.timezone = zone;
  request.savedAt = new Date().toISOString();
  request.status = "local-draft-only";
  try {
    localStorage.setItem(storageKey, JSON.stringify(request));
    status.textContent =
      "Your draft is saved on this device. No request was sent and no meeting was booked.";
    clearRequest.hidden = false;
  } catch {
    status.textContent =
      "This browser could not save a local draft. No request was sent.";
  }
});
clearRequest.addEventListener("click", () => {
  try {
    localStorage.removeItem(storageKey);
    form.reset();
    renderDates();
    status.textContent = "The saved request has been cleared from this device.";
    clearRequest.hidden = true;
  } catch {
    status.textContent = "The browser could not clear local storage.";
  }
});

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const loopVideos = [...document.querySelectorAll("[data-loop]")];
const visible = new Map();
const marquee = document.querySelector(".logo-track");
let marqueeVisible = false;

// Decode one decorative preview at a time. Other cards retain their stills.
function syncMedia() {
  const allowed = !document.hidden && !reduced.matches &&
    !document.querySelector("dialog[open]");
  const active = allowed
    ? [...visible].sort((a, b) => b[1] - a[1])[0]?.[0]
    : undefined;
  loopVideos.forEach((video) => {
    if (video !== active) {
      video.pause();
      return;
    }
    if (!video.getAttribute("src")) video.src = video.dataset.src;
    if (video.paused) video.play().catch(() => {});
  });
  if (marquee) marquee.style.animationPlayState =
    allowed && marqueeVisible ? "running" : "paused";
}
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
      if (isIntersecting) visible.set(target, intersectionRatio);
      else visible.delete(target);
    });
    syncMedia();
  },
  { threshold: [0.15, 0.5, 0.85] },
);
loopVideos.forEach((video) => observer.observe(video));
if (marquee) {
  const marqueeObserver = new IntersectionObserver(([entry]) => {
    marqueeVisible = entry.isIntersecting;
    syncMedia();
  });
  marqueeObserver.observe(marquee.parentElement);
}
reduced.addEventListener("change", syncMedia);
document.addEventListener("visibilitychange", syncMedia);
syncMedia();
