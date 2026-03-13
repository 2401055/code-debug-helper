import { useState, useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";
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

const sampleCode: Record<string, string> = {
  python: `def calculate_average(numbers):
    total = sum(numbers)
    count = len(numbers)
    return total / count

result = calculate_average([])
print(result)`,
  javascript: `function greet(name) {
  console.log("Hello, " + name.toUpperCase());
}

greet(null);`,
  java: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3};
        System.out.println(numbers[5]);
    }
}`,
};

interface InlineError {
  line: number;
  message: string;
}

interface AnalysisResult {
  explanation: string;
  steps: string[];
  correctedCode: string;
  errorType: string;
  severity: string;
  tips: string[];
  inlineErrors: InlineError[];
}

interface ExecutionResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: string;
}

export default function Editor() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(sampleCode.python || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showErrorInput, setShowErrorInput] = useState(false);

  const analyzeCode = trpc.code.analyze.useMutation({
    onSuccess: (data: any) => {
      setAnalysis(data as AnalysisResult);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    },
    onError: (error: any) => {
      setIsAnalyzing(false);
      toast.error("Analysis failed: " + error.message);
    },
  });

  const executeCode = trpc.code.execute.useMutation({
    onSuccess: (data: any) => {
      setExecution(data as ExecutionResult);
      setIsExecuting(false);
      setShowConsole(true);
      toast.success("Execution complete!");
    },
    onError: (error: any) => {
      setIsExecuting(false);
      toast.error("Execution failed: " + error.message);
    },
  });

  const handleAnalyze = useCallback(() => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze");
      return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);
    analyzeCode.mutate({
      code: code.trim(),
      language,
      errorMessage: errorMessage.trim() || undefined,
    });
  }, [code, language, errorMessage, analyzeCode]);

  const handleExecute = useCallback(() => {
    if (!code.trim()) {
      toast.error("Please enter some code to run");
      return;
    }
    setIsExecuting(true);
    setExecution(null);
    executeCode.mutate({
      code: code.trim(),
      language,
    });
  }, [code, language, executeCode]);

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setLanguage(newLang);
      if (sampleCode[newLang] && code === (sampleCode[language] || "")) {
        setCode(sampleCode[newLang]);
      }
    },
    [code, language]
  );

  const handleCopyCode = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }, []);

  const handleClear = useCallback(() => {
    setCode("");
    setErrorMessage("");
    setAnalysis(null);
    setExecution(null);
  }, []);

  // Extract inline errors for the editor
  const inlineErrors = useMemo(() => {
    return analysis?.inlineErrors || [];
  }, [analysis]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-0 h-[calc(100vh-3.5rem)]">
      {/* Left Panel: Code Editor */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border/50">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border/50 bg-card/30">
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary/50">
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

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 text-xs gap-1.5 text-muted-foreground"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowErrorInput(!showErrorInput)}
              className={`h-8 text-xs gap-1.5 ${showErrorInput ? "text-destructive" : "text-muted-foreground"}`}
            >
              <FileWarning className="h-3.5 w-3.5" />
              Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExecute}
              disabled={isExecuting || !code.trim()}
              className="h-8 text-xs gap-1.5 bg-transparent border-success/30 text-success hover:bg-success/10"
            >
              {isExecuting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isExecuting ? "Running..." : "Run"}
            </Button>
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className="h-8 text-xs gap-1.5"
            >
              {isAnalyzing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>

        {/* Error Message Input (collapsible) */}
        {showErrorInput && (
          <div className="border-b border-border/50 bg-card/30">
            <div className="flex items-center gap-2 px-4 py-2">
              <FileWarning className="h-4 w-4 text-destructive/70 shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Error Message (optional)
              </span>
            </div>
            <div className="px-4 pb-3">
              <Textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste the error message you received here... (e.g., TypeError: Cannot read property 'name' of undefined)"
                className="min-h-[60px] max-h-[100px] text-xs font-mono bg-secondary/30 border-border/50 resize-none"
              />
            </div>
          </div>
        )}

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            minHeight="100%"
            inlineErrors={inlineErrors}
          />
        </div>

        {/* Console Output Panel */}
        <div className="border-t border-border/50">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="w-full flex items-center justify-between px-4 py-2 bg-card/30 hover:bg-card/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Console Output
              </span>
              {execution && (
                <Badge
                  variant={execution.exitCode === 0 ? "secondary" : "destructive"}
                  className="text-[10px] h-4 px-1.5"
                >
                  {execution.exitCode === 0 ? "Success" : "Error"}
                </Badge>
              )}
            </div>
            {showConsole ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          {showConsole && (
            <div className="bg-[oklch(0.13_0.01_250)] border-t border-border/30 max-h-[200px] overflow-y-auto">
              {isExecuting ? (
                <div className="flex items-center gap-2 p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Running code...
                  </span>
                </div>
              ) : execution ? (
                <div className="p-3 font-mono text-xs">
                  {execution.output && (
                    <pre className="text-green-400 whitespace-pre-wrap mb-1">
                      {execution.output}
                    </pre>
                  )}
                  {execution.error && (
                    <pre className="text-red-400 whitespace-pre-wrap">
                      {execution.error}
                    </pre>
                  )}
                  <div className="mt-2 pt-2 border-t border-border/20 text-muted-foreground/60 flex items-center gap-3">
                    <span>Exit code: {execution.exitCode}</span>
                    <span>Time: {execution.executionTime}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-xs text-muted-foreground/50 text-center">
                  Click "Run" to execute your code and see the output here.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Analysis Results */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col overflow-hidden bg-card/20">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Analysis Results</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Analyzing your code...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  AI is reviewing your code and identifying issues
                </p>
              </div>
            </div>
          ) : analysis ? (
            <div className="p-4 space-y-4">
              {/* Error Type Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    analysis.severity === "error"
                      ? "destructive"
                      : analysis.severity === "warning"
                      ? "outline"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {analysis.errorType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {analysis.severity}
                </Badge>
                {analysis.inlineErrors.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {analysis.inlineErrors.length} issue{analysis.inlineErrors.length > 1 ? "s" : ""} found
                  </Badge>
                )}
              </div>

              {/* Inline Errors Summary */}
              {analysis.inlineErrors.length > 0 && (
                <Card className="p-3 bg-destructive/5 border-destructive/20">
                  <h3 className="text-xs font-semibold mb-2 flex items-center gap-2 text-destructive">
                    <XCircle className="h-3.5 w-3.5" />
                    Errors Found in Code
                  </h3>
                  <div className="space-y-1">
                    {analysis.inlineErrors.map((err, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-destructive/70 font-mono shrink-0">
                          Line {err.line}:
                        </span>
                        <span className="text-muted-foreground">
                          {err.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Explanation */}
              <Card className="p-4 bg-secondary/30 border-border/50">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  What Went Wrong
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed prose prose-invert prose-sm max-w-none">
                  <Streamdown>{analysis.explanation}</Streamdown>
                </div>
              </Card>

              {/* Step-by-Step Fix */}
              {analysis.steps && analysis.steps.length > 0 && (
                <Card className="p-4 bg-secondary/30 border-border/50">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Step-by-Step Fix
                  </h3>
                  <div className="space-y-2">
                    {analysis.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-primary">
                            {i + 1}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed prose prose-invert prose-sm max-w-none flex-1">
                          <Streamdown>{step}</Streamdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Corrected Code */}
              {analysis.correctedCode && (
                <Card className="p-4 bg-secondary/30 border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-primary" />
                      Corrected Code
                    </h3>
                    <div className="flex gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(analysis.correctedCode)}
                        className="h-7 text-xs gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCode(analysis.correctedCode);
                          toast.success("Applied corrected code to editor");
                        }}
                        className="h-7 text-xs gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Apply
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md overflow-hidden border border-border/50">
                    <CodeEditor
                      value={analysis.correctedCode}
                      onChange={() => {}}
                      language={language}
                      readOnly
                      minHeight="100px"
                    />
                  </div>
                </Card>
              )}

              {/* Tips */}
              {analysis.tips && analysis.tips.length > 0 && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-1.5">
                    {analysis.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground flex gap-2 items-start"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/70">
                  No Analysis Yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                  Write or paste your code, then click "Analyze" to get
                  AI-powered debugging help, or click "Run" to execute your code.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
