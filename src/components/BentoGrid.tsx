'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Server, Languages, Wrench, Github, ExternalLink } from 'lucide-react';

const Card = ({ children, secondaryContent, delay = 0, noTilt = false }: { children: React.ReactNode; secondaryContent?: React.ReactNode; delay?: number; noTilt?: boolean }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.9 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`glassmorphism rounded-3xl p-8 transition-all duration-300 h-full flex flex-col justify-between min-h-[400px] ${noTilt ? '' : 'hover:scale-105 hover:shadow-lg cursor-pointer'}`}
      {...(noTilt ? {} : {
        onHoverStart: () => setIsFlipped(true),
        onHoverEnd: () => setIsFlipped(false)
      })}
      whileHover={noTilt ? {} : { rotateX: 5, rotateY: -5 }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, rotateY: 180 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ opacity: 0, rotateY: 180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {secondaryContent}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface Project {
  name: string;
  headline: string;
  tech: string;
  details: string;
  url: string;
  isPrivate?: boolean;
  codeSnippet?: string;
  codeLanguage?: string;
}

export default function BentoGrid() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const projects: Project[] = [
    {
      name: "AlphaDocTN",
      headline: "Enterprise-level document architect",
      tech: "Laravel, Blade, PHP",
      details: "Secured RBAC Active",
      url: "https://github.com/TrafiTaha/alphadoctn",
      isPrivate: true,
      codeSnippet: `<?php
// RBAC Middleware Implementation
class RoleBasedAccessControl
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!auth()->user()->hasRole($role)) {
            abort(403, 'Unauthorized access');
        }
        
        return $next($request);
    }
}`,
      codeLanguage: 'php'
    },
    {
      name: "Agrisdol",
      headline: "Agricultural Intelligence Platform",
      tech: "Laravel, Node.js, SQLite",
      details: "Data Flow Active",
      url: "https://github.com/TrafiTaha/agrisdol",
      codeSnippet: `// Real-time Data Processing
const processAgriculturalData = async (sensorData) => {
    const processed = await analyzeSoilConditions(sensorData);
    const recommendations = generateFarmingAdvice(processed);
    
    return {
        soilHealth: processed.health,
        recommendations,
        timestamp: new Date()
    };
};`,
      codeLanguage: 'javascript'
    },
    {
      name: "WorkSphere",
      headline: "Team Synchronization Engine",
      tech: "Laravel, Blade",
      details: "Workflow Optimized",
      url: "https://github.com/TrafiTaha/worksphere",
      codeSnippet: `<?php
// Task Automation Engine
class WorkflowAutomation
{
    public function automateTaskAssignment()
    {
        $tasks = Task::where('status', 'pending')->get();
        
        foreach ($tasks as $task) {
            $bestAssignee = $this->findOptimalAssignee($task);
            $task->update(['assigned_to' => $bestAssignee->id]);
            
            Notification::send($bestAssignee, new TaskAssigned($task));
        }
    }
}`,
      codeLanguage: 'php'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const Sparkline = () => (
    <svg width="100" height="20" viewBox="0 0 100 20" className="text-green-400">
      <path
        d="M0,15 Q10,5 20,10 T40,8 T60,12 T80,6 T100,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="animate-pulse"
      />
    </svg>
  );

  return (
    <motion.section
      className="py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-12 gap-6 grid-auto-rows-1fr">
          {/* Row 1: 3 equal cards */}
          <motion.div className="col-span-4 h-full" variants={containerVariants}>
            <Card
              secondaryContent={
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-4">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="text-cyan-400">Lighthouse Score: 95%</div>
                    <div className="text-green-400">Bundle Size: 120KB</div>
                    <div className="text-purple-400">Load Time: 1.2s</div>
                  </div>
                </div>
              }
            >
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold">Frontend</h3>
              </div>
              <div className="flex-grow">
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Angular</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>3D Programming & Flutter</span>
                    <span>90%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>React</span>
                    <span>95%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Passionate about building scalable, user-centric applications.</p>
            </Card>
          </motion.div>
          <motion.div className="col-span-4 h-full" variants={containerVariants}>
            <Card
              secondaryContent={
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-4">Architecture Details</h4>
                  <div className="space-y-2">
                    <div className="text-green-400">MVC Pattern: Implemented</div>
                    <div className="text-blue-400">API Endpoints: 50+</div>
                    <div className="text-red-400">Security Layers: 3</div>
                  </div>
                </div>
              }
            >
              <div className="flex items-center mb-4">
                <Server className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-xl font-semibold">Backend</h3>
              </div>
              <div className="flex-grow">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">MVC Architecture & API Development</h4>
                  <p className="text-gray-400 text-lg">RESTful/GraphQL, Laravel, Symfony</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg px-3 py-2">
                  <span className="text-red-400 text-sm font-mono">Security: Authentication & MVC Architecture</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Striving for clean, maintainable code and high performance.</p>
            </Card>
          </motion.div>
          <motion.div className="col-span-4 h-full" variants={containerVariants}>
            <Card
              secondaryContent={
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-4">Optimization Stats</h4>
                  <div className="space-y-2">
                    <div className="text-purple-400">Algorithm Efficiency: 95%</div>
                    <div className="text-cyan-400">Memory Usage: Optimized</div>
                    <div className="text-green-400">Code Quality: A+</div>
                  </div>
                </div>
              }
            >
              <div className="flex items-center mb-4">
                <Languages className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-xl font-semibold">Languages</h3>
              </div>
              <div className="flex-grow">
                <div className="mb-3">
                  <div className="flex justify-between">
                    <span className="text-lg">PHP & Blade</span>
                    <span className="text-sm text-gray-400">15k+ LOC</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between">
                    <span className="text-lg">JavaScript/TypeScript</span>
                    <span className="text-sm text-gray-400">8 Projects</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between">
                    <span className="text-lg">C</span>
                    <span className="text-sm text-gray-400">Algorithm Focus</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Clean, maintainable code focusing on Algorithm Optimization</p>
            </Card>
          </motion.div>

          {/* Row 2 */}
          <motion.div className="col-span-4 h-full" variants={containerVariants}>
            <Card
              secondaryContent={
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-4">Tool Proficiency</h4>
                  <div className="space-y-2">
                    <div className="text-orange-400">DevOps: 90%</div>
                    <div className="text-blue-400">Version Control: Expert</div>
                    <div className="text-red-400">Testing: Comprehensive</div>
                  </div>
                </div>
              }
            >
              <div className="flex items-center mb-4">
                <Wrench className="w-8 h-8 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold">Tools</h3>
              </div>
              <div className="flex-grow">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-orange-400 mb-2">DevOps</h4>
                  <p className="text-gray-400 text-lg">Git, Docker</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-orange-400 mb-2">Architectural</h4>
                  <p className="text-gray-400 text-lg">Agile/Scrum, RESTful APIs</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* LinkedIn Biography Card */}
          <motion.div className="col-span-4 h-full" variants={containerVariants}>
            <Card
              secondaryContent={
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-4">Professional Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-blue-400">Full-Stack Developer</div>
                    <div className="text-green-400">Problem Solver</div>
                    <div className="text-purple-400">Tech Enthusiast</div>
                  </div>
                </div>
              }
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
                <h3 className="text-xl font-semibold">LinkedIn Profile</h3>
              </div>
              <div className="flex-grow">
                <p className="text-gray-300 text-sm mb-3">
                  Passionate full-stack developer specializing in Laravel, React, and modern web technologies. 
                  Focused on building scalable solutions and optimizing performance.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">•</span>
                    <span>3+ Years Experience</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>15k+ Lines of Code</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Open to Opportunities</span>
                  </div>
                </div>
              </div>
              <a 
                href="https://linkedin.com/in/taha-ben-romdhane" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm font-mono transition-colors"
              >
                linkedin.com/in/taha-ben-romdhane →
              </a>
            </Card>
          </motion.div>

          <motion.div className="col-span-8 h-full" variants={containerVariants}>
            <Card noTilt={true}>
              <div className="flex items-center mb-4">
                <Github className="w-8 h-8 text-gray-300 mr-3" />
                <h3 className="text-xl font-semibold">GitHub Repository Spotlight</h3>
              </div>
              <div className="flex-grow space-y-4">
                {projects.map((project) => (
                  <div 
                    key={project.name} 
                    className="border border-white/10 rounded-lg bg-black/20 overflow-hidden relative group"
                    onMouseEnter={() => setHoveredProject(project.name)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    {/* Terminal Window Top Bar */}
                    <div className="flex items-center px-4 py-2 bg-gray-800/50 border-b border-white/10">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="ml-4 text-xs text-gray-400 font-mono">{project.name} {project.isPrivate && '(Private/Elite)'}</div>
                      <div className="ml-auto">
                        <a href={project.url} target="_blank" rel="noopener noreferrer" title={`View ${project.name} on GitHub`} className="text-gray-400 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    {/* Terminal Content */}
                    <div className="p-4 relative">
                      <div className="font-semibold text-sm mb-2">{project.headline}</div>
                      <div className="font-mono text-xs text-cyan-400 mb-2">Tech: {project.tech}</div>
                      <div className="font-mono text-sm text-green-400 mb-3 whitespace-pre-line">
                        {`Status: ${project.details}`}
                      </div>
                      {project.name === 'AlphaDocTN' && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded px-2 py-1 mb-2">
                          <span className="text-red-400 text-xs font-mono">Security Level: High - RBAC</span>
                        </div>
                      )}
                      {project.name === 'Agrisdol' && (
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                          <span className="text-blue-400 text-xs font-mono">Data Flow Active</span>
                        </div>
                      )}
                      {project.name === 'WorkSphere' && (
                        <div className="text-yellow-400 text-xs font-mono mb-2">Productivity Boost: 40%</div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">Activity</div>
                        <Sparkline />
                      </div>
                      
                      {/* Code Preview Overlay */}
                      <AnimatePresence>
                        {hoveredProject === project.name && project.codeSnippet && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-lg p-4 flex flex-col justify-center"
                          >
                            <div className="text-xs text-gray-400 mb-2 font-mono">Code Preview</div>
                            <SyntaxHighlighter
                              language={project.codeLanguage}
                              style={vscDarkPlus}
                              customStyle={{
                                margin: 0,
                                padding: '12px',
                                fontSize: '11px',
                                lineHeight: '1.4',
                                background: 'transparent',
                                borderRadius: '6px'
                              }}
                              wrapLines={true}
                              wrapLongLines={true}
                            >
                              {project.codeSnippet}
                            </SyntaxHighlighter>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
