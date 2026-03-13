import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Play,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  RotateCcw,
  Lightbulb,
  Code2,
  FileWarning,
  Trash2,
  Terminal,
  XCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { Streamdown } from "streamdown";
import { useState } from "react";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "php", label: "PHP" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "markdown", label: "Markdown" },
];

export default function Editor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDebug = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Debug analysis complete (Demo mode)");
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Code Input */}
      <Card className="flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Code</h2>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            language={language}
            value={code}
            onChange={setCode}
          />
        </div>
      </Card>

      {/* Results */}
      <Card className="flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Analysis</h2>
            <Button
              onClick={handleDebug}
              disabled={isLoading || !code.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Debug with AI
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {error && (
            <div className="flex gap-3 p-4 bg-destructive/10 rounded-lg text-destructive mb-4">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          {!error && !code && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Code2 className="w-12 h-12 mb-4 opacity-50" />
              <p>Enter code and click "Debug with AI" to analyze</p>
            </div>
          )}
          {code && !error && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <Streamdown>
                  # Code Analysis (Demo Mode)
                  
                  This is a demonstration of the Code Debug Helper in static mode.
                  
                  To enable full AI debugging capabilities, upgrade to the full-stack version.
                </Streamdown>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
