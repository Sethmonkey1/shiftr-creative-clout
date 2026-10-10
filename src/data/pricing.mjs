// Reference starting prices; increments are editable study values, not a quotation.
export const packages = [
  {
    id: "hype",
    name: "Hype video",
    base: 5900,
    seconds: 30,
    increment: 1500,
    max: 90,
    description: "One feature. One launch. One memorable moment.",
    features: [
      "A short, focused product story",
      "Designed for campaigns and teasers",
      "Optional hook and CTA variations",
    ],
    popular: false,
  },
  {
    id: "explainer",
    name: "Explainer video",
    base: 8400,
    seconds: 60,
    increment: 1500,
    max: 180,
    description: "A clear introduction to what makes your product matter.",
    features: [
      "A complete product narrative",
      "Website and sales-ready formats",
      "Optional hook and CTA variations",
    ],
    popular: true,
  },
  {
    id: "brand",
    name: "Brand narrative",
    base: 9800,
    seconds: 90,
    increment: 1500,
    max: 210,
    description: "Bring your purpose, people, and point of view together.",
    features: [
      "A story beyond the feature list",
      "For your brand, culture, or mission",
      "Optional hook and CTA variations",
    ],
    popular: false,
  },
];
export function calculatePrice(plan, seconds) {
  const duration = Math.max(
    plan.seconds,
    Math.min(
      plan.max,
      plan.seconds + Math.round((seconds - plan.seconds) / 30) * 30,
    ),
  );
  return {
    seconds: duration,
    price: plan.base + ((duration - plan.seconds) / 30) * plan.increment,
  };
}
