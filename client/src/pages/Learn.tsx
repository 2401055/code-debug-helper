import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BookOpen,
  Search,
  AlertTriangle,
  Zap,
  Brain,
  Type,
  Link2,
  Clock,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Lightbulb,
  Filter,
} from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import {
  errorCategories,
  errorExamples,
  type ErrorExample,
} from "@shared/errorLibrary";

const categoryIcons: Record<string, any> = {
  AlertTriangle,
  Zap,
  Brain,
  Type,
  Link: Link2,
  Clock,
};

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showIncorrect, setShowIncorrect] = useState<Record<string, boolean>>(
    {}
  );

  const filteredErrors = useMemo(() => {
    return errorExamples.filter((error) => {
      const matchesCategory =
        selectedCategory === "all" || error.category === selectedCategory;
      const matchesDifficulty =
        difficultyFilter === "all" || error.difficulty === difficultyFilter;
      const matchesSearch =
        searchQuery === "" ||
        error.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.language.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, difficultyFilter, searchQuery]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }, []);

  return (
    <div className="container py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Learning Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Common programming errors with explanations and examples
            </p>
          </div>
        </div>
      </div>

      {/* Debugging Tips Section */}
      <Card className="p-5 mb-8 bg-primary/5 border-primary/20">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          Debugging Tips for Beginners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              title: "Read the Error Message",
              desc: "Error messages tell you the type of error and the line number. Always start there.",
            },
            {
              title: "Check Line Numbers",
              desc: "The error is usually on or near the line number mentioned in the error message.",
            },
            {
              title: "Use Print Statements",
              desc: "Add print/console.log statements to check variable values at different points.",
            },
            {
              title: "Check Spelling & Syntax",
              desc: "Typos in variable names, missing semicolons, or unclosed brackets are common.",
            },
            {
              title: "Google the Error",
              desc: "Copy the error message and search online. Stack Overflow often has the answer.",
            },
            {
              title: "Test Small Pieces",
              desc: "Break your code into smaller parts and test each piece separately.",
            },
          ].map((tip, i) => (
            <div
              key={i}
              className="flex gap-3 items-start p-3 rounded-lg bg-background/50"
            >
              <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold mb-0.5">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search errors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-secondary/30"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs bg-secondary/30">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-xl border p-3 text-left transition-all ${
            selectedCategory === "all"
              ? "bg-primary/10 border-primary/30"
              : "bg-card/30 border-border/50 hover:bg-card/60"
          }`}
        >
          <BookOpen
            className={`h-5 w-5 mb-2 ${
              selectedCategory === "all"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          />
          <p className="text-xs font-medium">All Errors</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {errorExamples.length} examples
          </p>
        </button>
        {errorCategories.map((cat) => {
          const Icon = categoryIcons[cat.icon] || AlertTriangle;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl border p-3 text-left transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card/30 border-border/50 hover:bg-card/60"
              }`}
            >
              <Icon
                className={`h-5 w-5 mb-2 ${
                  selectedCategory === cat.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <p className="text-xs font-medium">{cat.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {cat.errorCount} examples
              </p>
            </button>
          );
        })}
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {filteredErrors.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No errors found matching your filters.
            </p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <Card
              key={error.id}
              className="overflow-hidden border-border/50 bg-card/30"
            >
              {/* Error Header */}
              <button
                onClick={() =>
                  setExpandedError(
                    expandedError === error.id ? null : error.id
                  )
                }
                className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">{error.title}</h3>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {error.language}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] h-5 ${
                          error.difficulty === "beginner"
                            ? "bg-green-500/10 text-green-400"
                            : error.difficulty === "intermediate"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {error.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {error.description}
                    </p>
                  </div>
                </div>
                {expandedError === error.id ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedError === error.id && (
                <div className="border-t border-border/50 p-4 space-y-4">
                  {/* Explanation */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Explanation
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {error.explanation}
                    </p>
                  </div>

                  {/* Code Examples */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Code Example
                      </h4>
                      <div className="flex gap-1">
                        <Button
                          variant={
                            showIncorrect[error.id] !== false
                              ? "default"
                              : "ghost"
                          }
                          size="sm"
                          onClick={() =>
                            setShowIncorrect((prev) => ({
                              ...prev,
                              [error.id]: true,
                            }))
                          }
                          className="h-6 text-[10px] px-2"
                        >
                          Incorrect
                        </Button>
                        <Button
                          variant={
                            showIncorrect[error.id] === false
                              ? "default"
                              : "ghost"
                          }
                          size="sm"
                          onClick={() =>
                            setShowIncorrect((prev) => ({
                              ...prev,
                              [error.id]: false,
                            }))
                          }
                          className="h-6 text-[10px] px-2"
                        >
                          Correct
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-border/50">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/50 border-b border-border/50">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {showIncorrect[error.id] !== false
                            ? "incorrect_example"
                            : "correct_example"}
                          .{error.language}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopy(
                              showIncorrect[error.id] !== false
                                ? error.incorrectCode
                                : error.correctCode
                            )
                          }
                          className="h-5 text-[10px] px-1.5"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <CodeEditor
                        value={
                          showIncorrect[error.id] !== false
                            ? error.incorrectCode
                            : error.correctCode
                        }
                        onChange={() => {}}
                        language={error.language}
                        readOnly
                        minHeight="80px"
                      />
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-primary" />
                      Tips
                    </h4>
                    <ul className="space-y-1.5">
                      {error.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="text-xs text-muted-foreground flex gap-2 items-start"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
