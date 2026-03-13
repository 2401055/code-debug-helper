import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import {
  Bug,
  Code2,
  BookOpen,
  Zap,
  ArrowRight,
  Terminal,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Shield,
  Globe,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const features = [
  {
    icon: Code2,
    title: "Smart Code Editor",
    description:
      "Full-featured editor with syntax highlighting, line numbers, and support for 15+ programming languages.",
  },
  {
    icon: Zap,
    title: "Real-Time Detection",
    description:
      "Get instant error detection and suggestions as you type, just like professional development tools.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description:
      "Advanced AI analyzes your code and error messages to provide clear, beginner-friendly explanations.",
  },
  {
    icon: Lightbulb,
    title: "Step-by-Step Fixes",
    description:
      "Understand exactly why errors happen with detailed debugging walkthroughs and corrected code examples.",
  },
  {
    icon: BookOpen,
    title: "Learning Library",
    description:
      "Browse common programming errors with before/after examples to build your debugging skills.",
  },
  {
    icon: Shield,
    title: "Save & Track Progress",
    description:
      "Save your code snippets and track your learning progress across debugging sessions.",
  },
];

const supportedLanguages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C/C++",
  "C#",
  "HTML/CSS",
  "PHP",
  "Rust",
  "Go",
  "Ruby",
  "Swift",
  "Kotlin",
  "SQL",
  "And more...",
];

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Bug className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Code Debug Helper
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!loading && !user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = getLoginUrl())}
                className="text-xs text-muted-foreground"
              >
                Sign in
              </Button>
            )}
            <Link href="/editor">
              <Button size="sm" className="text-xs gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                Open Editor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.25_0.08_250)_0%,transparent_60%)]" />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Debugging Assistant
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Understand & Fix{" "}
              <span className="text-primary">Code Errors</span>{" "}
              <br className="hidden sm:block" />
              in Seconds
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Paste your code, describe the error, and get instant AI-powered
              explanations with step-by-step solutions. Built for beginners who
              want to learn, not just fix.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/editor">
                <Button size="lg" className="gap-2 px-6 text-sm">
                  <Terminal className="h-4 w-4" />
                  Start Debugging
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 px-6 text-sm bg-transparent"
                >
                  <BookOpen className="h-4 w-4" />
                  Browse Error Library
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Code preview mockup */}
          <motion.div
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur overflow-hidden shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">
                  main.py
                </span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="flex gap-4">
                  <div className="text-muted-foreground/40 select-none text-right w-6">
                    1<br />2<br />3<br />4<br />5<br />6
                  </div>
                  <div>
                    <span className="text-blue-400">def</span>{" "}
                    <span className="text-yellow-300">calculate_average</span>
                    <span className="text-foreground">(numbers):</span>
                    <br />
                    <span className="text-foreground">
                      {"    "}total = <span className="text-blue-400">sum</span>
                      (numbers)
                    </span>
                    <br />
                    <span className="text-foreground">
                      {"    "}count = <span className="text-blue-400">len</span>
                      (numbers)
                    </span>
                    <br />
                    <span className="text-foreground">
                      {"    "}
                      <span className="text-purple-400">return</span> total /
                      count
                    </span>
                    <br />
                    <br />
                    <span className="text-foreground">
                      result = calculate_average(
                      <span className="text-orange-300">[]</span>)
                    </span>
                    <span className="ml-2 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                      ZeroDivisionError
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Everything You Need to Debug Smarter
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A complete toolkit designed to help beginner programmers understand
              errors and improve their debugging skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card/30 p-6 hover:bg-card/60 hover:border-border transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-20 border-t border-border/30">
        <div className="container">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border/50 text-xs font-medium mb-4">
              <Globe className="h-3.5 w-3.5 text-primary" />
              Multi-Language Support
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Works With Any Language
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our AI understands errors across all major programming languages
              and frameworks.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {supportedLanguages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-xs font-medium text-foreground/80"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to understand and fix any coding error.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Paste Your Code",
                description:
                  "Write or paste your code in the editor. Select the programming language for best results.",
              },
              {
                step: "02",
                title: "Describe the Error",
                description:
                  "Enter the error message you received. The AI uses both your code and the error for analysis.",
              },
              {
                step: "03",
                title: "Get Solutions",
                description:
                  "Receive a clear explanation of the problem, step-by-step fix instructions, and corrected code.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <div className="text-4xl font-bold text-primary/20 mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Ready to Debug Smarter?
            </h2>
            <p className="text-muted-foreground mb-8">
              Stop spending hours searching for error solutions. Get instant,
              beginner-friendly explanations in seconds.
            </p>
            <Link href="/editor">
              <Button size="lg" className="gap-2 px-8">
                <Terminal className="h-4 w-4" />
                Start Debugging Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Code Debug Helper</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Helping beginners understand and fix code errors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
