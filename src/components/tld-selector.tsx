"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POPULAR_TLDS, TLD } from "@/types";

interface TldSelectorProps {
  selectedTlds: string[];
  onTldChange: (selectedTlds: string[]) => void;
}

export function TldSelector({ selectedTlds, onTldChange }: TldSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>("popular");

  const handleTldToggle = (tld: string) => {
    const updatedTlds = selectedTlds.includes(tld)
      ? selectedTlds.filter((t) => t !== tld)
      : [...selectedTlds, tld];

    onTldChange(updatedTlds);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Select Domain Extensions</CardTitle>
        <CardDescription>
          Choose which domain extensions to check availability for
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="all" disabled>All TLDs</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {POPULAR_TLDS.map((tld) => (
                <div key={tld.extension} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tld-${tld.extension}`}
                    checked={selectedTlds.includes(tld.extension)}
                    onCheckedChange={() => handleTldToggle(tld.extension)}
                  />
                  <label
                    htmlFor={`tld-${tld.extension}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tld.name}
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
