import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Code2, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function SavedSnippets() {
  const { user, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();

  const { data: snippets, isLoading } = trpc.code.getSnippets.useQuery(undefined, {
    enabled: !!user,
  });

  const deleteSnippet = trpc.code.deleteSnippet.useMutation({
    onSuccess: () => {
      toast.success("Snippet deleted");
      utils.code.getSnippets.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete snippet: " + error.message);
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your snippets...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Code2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sign in to save snippets</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Keep track of your debugging history and save important code snippets for later reference.
        </p>
        <Button onClick={() => (window.location.href = "/api/auth/login")}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Snippets</h1>
          <p className="text-muted-foreground mt-1">
            Your collection of debugged code and analysis history.
          </p>
        </div>
        <Link href="/editor">
          <Button className="gap-2">
            <Code2 className="h-4 w-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {!snippets || snippets.length === 0 ? (
        <Card className="border-dashed py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No snippets saved yet</h3>
            <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
              When you analyze code in the editor, you can save it to your library.
            </p>
            <Link href="/editor">
              <Button variant="outline">Go to Editor</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <Card key={snippet.id} className="overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-1">{snippet.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] h-4">
                        {snippet.language}
                      </Badge>
                      {snippet.isFixed && (
                        <Badge variant="outline" className="text-[10px] h-4 bg-success/10 text-success border-success/20">
                          Fixed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteSnippet.mutate({ id: snippet.id })}
                    disabled={deleteSnippet.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="bg-muted/50 rounded-md p-3 mb-4 flex-1">
                  <pre className="text-xs font-mono line-clamp-6 text-muted-foreground">
                    {snippet.code}
                  </pre>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(snippet.createdAt).toLocaleDateString()}
                  </div>
                  <Link href={`/editor?snippet=${snippet.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5">
                      Open
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
