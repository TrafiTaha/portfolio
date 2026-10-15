import dynamic from "next/dynamic";
import { Award, Boxes, Github, Images, Send, User, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import About from "@/components/sections/About";
import AboutRoom from "@/components/experience/rooms/AboutRoom";
import { CertificatesGallery, ProjectsGallery } from "@/components/experience/rooms/Gallery";
import SkillsTunnel from "@/components/experience/rooms/SkillsTunnel";

const Skills = dynamic(() => import("@/components/sections/Skills"));
const Certificates = dynamic(() => import("@/components/sections/Certificates"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const GitHubActivity = dynamic(() => import("@/components/sections/GitHubActivity"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export type DoorDef = {
  id: string;
  title: string;
  line: string;
  Icon: LucideIcon;
  /** true: the room is a scrolling page; false: a full-screen scene with its own input */
  scroll: boolean;
  Room: ComponentType;
};

// One door per portfolio chapter. Scenes: gallery (clothesline), studio (depth tunnel), about (paper plane).
export const DOORS: DoorDef[] = [
  { id: "projects", title: "Projects", line: "Three things I built, end to end.", Icon: Images, scroll: false, Room: ProjectsGallery },
  { id: "about", title: "About", line: "Who is behind the desk.", Icon: User, scroll: true, Room: AboutRoom },
  { id: "skills", title: "Skills", line: "The tools floating around the studio.", Icon: Boxes, scroll: false, Room: SkillsTunnel },
  { id: "certificates", title: "Certificates", line: "The paper trail, pinned up.", Icon: Award, scroll: false, Room: CertificatesGallery },
  { id: "github", title: "GitHub", line: "Live from the source.", Icon: Github, scroll: true, Room: GitHubActivity },
  { id: "contact", title: "Contact", line: "Knock, and say hello.", Icon: Send, scroll: true, Room: Contact },
];

// Classic long page sections (unchanged)
export { About, Skills, Certificates, Projects, GitHubActivity, Contact };
