import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the project root from this file's location, not the process cwd —
// a stray package.json in the user home directory breaks root inference otherwise.
const projectRoot =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  // A stray lockfile exists in the user home directory; pin the workspace root here.
  turbopack: { root: projectRoot },
};

export default nextConfig;
