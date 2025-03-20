"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface KeywordFormProps {
  onSubmit: (keyword: string) => void;
  isLoading: boolean;
}

export function KeywordForm({ onSubmit, isLoading }: KeywordFormProps) {
  const [keyword, setKeyword] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword to search",
        variant: "destructive",
      });
      return;
    }

    // Validate keyword (only alphanumeric and hyphens for domain names)
    const validKeyword = /^[a-zA-Z0-9-]+$/;
    if (!validKeyword.test(keyword)) {
      toast({
        title: "Invalid keyword",
        description: "Please use only letters, numbers, and hyphens",
        variant: "destructive",
      });
      return;
    }

    onSubmit(keyword.trim());
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Multilingual Domain Scanner</CardTitle>
        <CardDescription>
          Enter a keyword to find available domain names in multiple languages
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <label htmlFor="keyword" className="text-sm font-medium leading-none">
                Keyword
              </label>
              <Input
                id="keyword"
                placeholder="Enter a keyword (e.g. cloud, health, tech)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Translating..." : "Find Domains"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
