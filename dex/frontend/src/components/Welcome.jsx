import { Button } from "@/components/ui/button";
import { Brain, Code2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <div className="p-4 rounded-xl bg-gradient-ai shadow-ai">
                            <Brain className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-ai-primary to-ai-secondary bg-clip-text text-transparent">
                            AI Mate
                        </h1>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                        Your AI Code Companion
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Experience the future of coding with intelligent assistance, smart suggestions, and automated workflows.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/login">
                        <Button className="bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90 text-white font-medium shadow-ai transition-all duration-200 px-8 py-3">
                            <Sparkles className="w-5 h-5 mr-2" />
                            Get Started
                        </Button>
                    </Link>
                    <Button variant="outline" className="border-border text-foreground hover:bg-secondary px-8 py-3">
                        <Code2 className="w-5 h-5 mr-2" />
                        Learn More
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                    <div className="p-6 rounded-lg bg-gradient-card border border-border shadow-glow">
                        <Sparkles className="h-8 w-8 text-ai-primary mb-4 mx-auto" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Smart AI</h3>
                        <p className="text-muted-foreground">Advanced AI that understands your code and provides intelligent suggestions.</p>
                    </div>
                    <div className="p-6 rounded-lg bg-gradient-card border border-border shadow-glow">
                        <Code2 className="h-8 w-8 text-ai-secondary mb-4 mx-auto" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Code Generation</h3>
                        <p className="text-muted-foreground">Generate high-quality code snippets and complete functions instantly.</p>
                    </div>
                    <div className="p-6 rounded-lg bg-gradient-card border border-border shadow-glow">
                        <Brain className="h-8 w-8 text-ai-primary mb-4 mx-auto" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Continuous Learning</h3>
                        <p className="text-muted-foreground">AI that adapts to your coding style and learns from your preferences.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;