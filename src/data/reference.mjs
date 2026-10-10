import { assetMap } from "./asset-map.mjs";
const image = (name) => assetMap[name];
export const media = {
  icon: image("VgYF8ll7IxP98EH8danWAe2WKNA"),
  logo: image("LPon8whB2gYaXwZINIQ4ZCHZhw"),
  script: image("9PPNHcKObcC6Vto74VISLoLLYU"),
  testimonial: image("DYt4C7yCpKngsKJonK8YQn0quY"),
  founder: image("DvFwV0A65czoeKB5XTx1PtI"),
  clarity: "/assets/reference/clarity.mp4",
};
export const logos = [
  ["Multiply", "H97YybOHVpMRetUTfPifS1oOfc"],
  ["Bloom", "9hfHL6VbuWx38NhGtpLZUxN40JY"],
  ["Microsoft Azure", "QuJEbXBbhfdjaKFjUjKLl7QaFk"],
  ["Ramp", "Dftct134n5wJ95BI0vEVNDROo"],
  ["Home Service Pros", "aKpXKM8NnAwyBy66fbhdYkhho"],
  ["Bubble", "TfK564QXEdhWgi5G1orc9TfFTjE"],
  ["Grasp AI", "Qs2hHpFREui7Uv14UXcCNxSlXQ"],
  ["Coursera", "HeopDYSufWILURQp9gVGzvooAf8"],
  ["Atolio", "oFYx0Riv8VW9Xz3QhQbDxskalU"],
  ["Flow", "X6YcFqWTN847aYz3R3KneI2OqI"],
  ["Magic Pattern", "6hMXWK0je9e1GxCSavI4sAfxyM"],
].map(([name, file]) => ({ name, image: image(file) }));
export const projects = [
  [
    "Sira",
    "Explainer",
    "AI HR platform",
    "dX9Gk6C8lFdGEarXmkNr2z7BDm4",
    "f319b988-f8a2-4239-8af2-f67b51a5f42d",
  ],
  [
    "Atolio",
    "Explainer",
    "AI search platform",
    "IuugDfGWhESPCVqXst5IxK1cgts",
    "d95d16c9-5604-42d0-883b-517b08d478b6",
  ],
  [
    "Adwave",
    "Hype",
    "AI advertising",
    "1heHTSuXK81slkxYUyVpsgPp22k",
    "5394f812-19f0-43e0-89f2-1c0dfa03cee5",
  ],
  [
    "Gortex",
    "Brand film",
    "AI decisioning",
    "nHRPyCkPBCGTzpyEz1AFRk3Ny4",
    "61896d78-cd6e-454b-983b-6e1c05fc6fb0",
  ],
  [
    "Tribe Accred AI",
    "Explainer",
    "Accreditation software",
    "mpj6A9GXm2MKfCjD2PQL3htRbA",
    "4a20a469-3983-43e1-b7c4-2748e4fa86e9",
  ],
  [
    "Home Service Pros",
    "Explainer",
    "Home services",
    "zAk64F7yp5fuRAxjzwfQXwyEjw",
    "03d7e0fb-92e3-413c-b0d2-422429a0da47",
  ],
  [
    "Showbooks",
    "Explainer",
    "Financial software",
    "tvsVTUTMrrdHZ97LAU8YWSScC8",
    "a19dfc68-8c8f-4149-96e5-74202e3c7bb8",
  ],
  [
    "Regy",
    "Explainer",
    "Legal software",
    "WOSJWyqClhMuvYZYwmAQvKvXDA",
    "0114cd71-89fa-4c85-8fa0-778f792cca97",
  ],
  [
    "Focusblock",
    "Hype",
    "Focus & productivity",
    "hOGwgC9OwKApwvSG3i40Ed4hifk",
    "c177e30b-e4a0-4a2f-9d47-f8059a373924",
  ],
  ["Magic Pattern", "Hype", "AI website builder", "nZGiS9aAu85o0kmRqNWzF1JAg"],
  ["Flow × Ramp", "Explainer", "AI accounting", "EnTdJ72toxMGZIO8bgUxlVetaZc"],
  ["Coursera × Microsoft", "Hype", "AI workflows", "EIpXph9qEdTCKnoRE8ADbSkuU"],
  ["Multiply AI", "Hype", "AI software", "NXManGmWhH74mMMvq5P3OS067jI"],
  [
    "tix4cause",
    "Animation",
    "Events & ticketing",
    "WtSRblMt3pp9KQtEz3S1spakSYE",
  ],
  ["Artist List", "Animation", "Beauty services", "ODPw2ucxvPGmPti2fZaqMWoYRE"],
].map(([name, type, category, file, videoId]) => ({
  name,
  type,
  category,
  image: image(file),
  video:
    {
      dX9Gk6C8lFdGEarXmkNr2z7BDm4:
        "https://vz-41f371e2-ff7.b-cdn.net/bf0212e3-bd31-488b-8f1d-655f9d9f5709/playlist.m3u8",
      IuugDfGWhESPCVqXst5IxK1cgts:
        "https://vz-41f371e2-ff7.b-cdn.net/7e5015ad-cdb4-449a-b32c-7eb17c1f5024/playlist.m3u8",
      "1heHTSuXK81slkxYUyVpsgPp22k":
        "https://vz-41f371e2-ff7.b-cdn.net/4c485c53-2d83-4346-9b98-af060a2f73af/playlist.m3u8",
      nHRPyCkPBCGTzpyEz1AFRk3Ny4:
        "https://vz-41f371e2-ff7.b-cdn.net/5d64b395-dd3d-439c-a60e-af2e43c4c898/playlist.m3u8",
      mpj6A9GXm2MKfCjD2PQL3htRbA:
        "https://vz-41f371e2-ff7.b-cdn.net/c1b89454-2cd7-4747-8ad8-53b1d1602f39/playlist.m3u8",
      zAk64F7yp5fuRAxjzwfQXwyEjw:
        "https://vz-41f371e2-ff7.b-cdn.net/b91cf7aa-40d6-446b-a5ee-ee649d3ef690/playlist.m3u8",
      tvsVTUTMrrdHZ97LAU8YWSScC8:
        "https://vz-41f371e2-ff7.b-cdn.net/33094067-2d60-4047-9b05-43cbbd8eb6a4/playlist.m3u8",
      WOSJWyqClhMuvYZYwmAQvKvXDA:
        "https://vz-41f371e2-ff7.b-cdn.net/b186448c-6e99-43b4-8681-50a6843bfa6f/playlist.m3u8",
      hOGwgC9OwKApwvSG3i40Ed4hifk:
        "https://vz-41f371e2-ff7.b-cdn.net/103d215c-a19f-47d7-ba88-39df718760de/playlist.m3u8",
      nZGiS9aAu85o0kmRqNWzF1JAg:
        "https://vz-41f371e2-ff7.b-cdn.net/e5075226-9813-424c-acc9-6db9b6eafea0/playlist.m3u8",
      EnTdJ72toxMGZIO8bgUxlVetaZc:
        "https://vz-41f371e2-ff7.b-cdn.net/a19dfc68-8c8f-4149-96e5-74202e3c7bb8/playlist.m3u8",
      EIpXph9qEdTCKnoRE8ADbSkuU:
        "https://vz-41f371e2-ff7.b-cdn.net/b96ce596-47a4-4efd-a199-7a5e387e482b/playlist.m3u8",
      NXManGmWhH74mMMvq5P3OS067jI:
        "https://vz-41f371e2-ff7.b-cdn.net/d95d16c9-5604-42d0-883b-517b08d478b6/playlist.m3u8",
      WtSRblMt3pp9KQtEz3S1spakSYE:
        "https://vz-41f371e2-ff7.b-cdn.net/4a20a469-3983-43e1-b7c4-2748e4fa86e9/playlist.m3u8",
      ODPw2ucxvPGmPti2fZaqMWoYRE:
        "https://vz-41f371e2-ff7.b-cdn.net/61896d78-cd6e-454b-983b-6e1c05fc6fb0/playlist.m3u8",
    }[file] || "",
  source: "https://creative-clout.com/book-a-call#examples",
}));

export const people = [
  [
    "Andrew Maddox",
    "Komi",
    "XCjXy7Qlkv9URlfvZgPOKyA4",
    "Sales impact and a collaborative partnership.",
  ],
  [
    "Sam Cleavenger",
    "Alexander Dev Group",
    "HFXKbevPP716NCLwg5rXgoy64A",
    "Clearer demos and a more efficient sales process.",
  ],
  [
    "Becca Mader",
    "Artist List",
    "jzTENR0rE7gsORwXKVHCfW5tW5M",
    "Helping new customers understand the product sooner.",
  ],
  [
    "Connor Heffernan",
    "Heff OS",
    "1PeGIOXIE0FOnUq913dJJ8Ddldc",
    "A launch asset delivered with clear communication.",
  ],
  [
    "Michael Switzer",
    "Nexacloud",
    "WKfUdOVJJMVl4EYcAUeNXHhFSE",
    "Video support across multiple product launches.",
  ],
  [
    "Harsha Viswanath",
    "Client perspective",
    "t5eDG5oaTtmGW79bxajZ6fLWc",
    "Storytelling and a quick turnaround.",
  ],
].map(([name, company, file, summary]) => ({
  name,
  company,
  image: image(file),
  summary,
}));
