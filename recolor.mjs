import fs from "node:fs";

const map = {
  // main accent (pink)
  "#c94726": "#ec5f8f", "#c84626": "#ec5f8f", "#c94626": "#ec5f8f",
  "#c84b2c": "#ec5f8f", "#bf4327": "#ec5f8f", "#c23f25": "#ec5f8f",
  "#b93c20": "#ec5f8f", "#c43022": "#ec5f8f", "#bf3823": "#ec5f8f",
  "#bd4b28": "#d94a7a", "#b93b1d": "#d94a7a",
  // butter yellow
  "#e4a424": "#f7c948", "#f3b51e": "#f7c948", "#f2c32c": "#f7c948",
  "#df9e22": "#f7c948", "#e7ad35": "#f7c948", "#d7a64a": "#f7c948",
  "#ddb164": "#fbe08a",
  // backgrounds
  "#f4efe5": "#fdf3f0", "#f9f4ea": "#fff8f5", "#fff8ec": "#fff8f5",
  "#fff8e9": "#fff8f5", "#f3e6c9": "#fff8f5", "#f7efe1": "#fff4ee",
  // dark (deep plum instead of black)
  "#1e1a17": "#3a1f2b", "#1d1916": "#3a1f2b", "#1f1b18": "#3a1f2b",
  "#191512": "#3a1f2b", "#181411": "#3a1f2b", "#211d19": "#3a1f2b",
  "#191511": "#3a1f2b", "#171411": "#3a1f2b", "#29221d": "#3a1f2b",
  "#24221e": "#3a1f2b", "#1d1b19": "#3a1f2b", "#24211e": "#3a1f2b",
  "#2b2723": "#3a1f2b", "#302b26": "#3a1f2b", "#302d29": "#3a1f2b",
  // blue touch
  "#3f7895": "#6fb3d9", "#246aa5": "#a8d8ea",
  // strip swatch pink
  "#d64a2c": "#f9a8c4",
  // borders
  "#d8a76a": "#f0b8c8", "#cfbba3": "#f0b8c8", "#d3a881": "#f0b8c8",
  "#c9ad8e": "#f0b8c8",
  // muted text
  "#5f554d": "#8a5d6c", "#71645b": "#8a5d6c", "#564c45": "#8a5d6c",
  "#645950": "#8a5d6c", "#75685e": "#8a5d6c", "#796c62": "#8a5d6c",
  "#88796e": "#8a5d6c", "#8c7d71": "#8a5d6c", "#443c31": "#8a5d6c",
  // small decorations
  "#d9c28d": "#f9c8d8", "#cf9a5f": "#f9a8c4",
  "#d9d1c4": "#f6dfe6", "#aa9e91": "#c48ba1", "#d7cbb7": "#f9d9e3",
  // booth curtain (velvet pink)
  "#5c1814": "#a83a63", "#37100d": "#7a2347", "#821f19": "#d4577f",
  "#43100e": "#8a2a50", "#2f0b0a": "#6b1d3d", "#781c18": "#c24a74",
  "#33100e": "#7a2347",
  // rgba values
  "rgba(248, 244, 235, 0.84)": "rgba(255, 248, 245, 0.84)",
  "rgba(187, 99, 42, 0.38)": "rgba(236, 95, 143, 0.35)",
  "rgba(255, 253, 247, 0.42)": "rgba(255, 248, 245, 0.55)",
  "rgba(90, 23, 8, 0.18)": "rgba(122, 20, 60, 0.2)",
  "rgba(81, 18, 7, 0.25)": "rgba(122, 20, 60, 0.25)",
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(Object.keys(map).map(escape).join("|"), "gi");

for (const file of ["src/index.css", "src/App.jsx"]) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(pattern, (m) => map[m.toLowerCase()]);
  fs.writeFileSync(file, after);
  console.log(`${file}: done`);
}