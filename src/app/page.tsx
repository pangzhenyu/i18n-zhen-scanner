"use client";

import { useState, useEffect } from "react";
import { KeywordForm } from "@/components/keyword-form";
import { TldSelector } from "@/components/tld-selector";
import { DomainResults } from "@/components/domain-results";
import { DomainInfo, Translation, TranslationResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [keyword, setKeyword] = useState<string>("");
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedTlds, setSelectedTlds] = useState<string[]>(["com", "net", "org"]);
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isCheckingDomains, setIsCheckingDomains] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle the keyword form submission
  const handleKeywordSubmit = async (newKeyword: string) => {
    setKeyword(newKeyword);
    setIsTranslating(true);
    setDomains([]);

    try {
      // Call the translation API
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: newKeyword }),
      });

      if (!response.ok) {
        throw new Error("Failed to translate keyword");
      }

      const data: TranslationResponse = await response.json();
      setTranslations(data.translations || []);

      // Generate domains from translations and selected TLDs
      if (data.translations && data.translations.length > 0 && selectedTlds.length > 0) {
        generateDomains(data.translations, selectedTlds);
      }
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate the keyword. Please try again.",
        variant: "destructive",
      });
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle TLD selection changes
  const handleTldChange = (newTlds: string[]) => {
    setSelectedTlds(newTlds);

    // If we already have translations, regenerate domains
    if (translations.length > 0 && newTlds.length > 0) {
      generateDomains(translations, newTlds);
    }
  };

  // Generate domain combinations from translations and TLDs
  const generateDomains = (translations: Translation[], tlds: string[]) => {
    // Filter translations to only include those with ASCII characters
    const validTranslations = translations.filter(t => /^[a-zA-Z0-9-]+$/.test(t.translation));

    if (validTranslations.length === 0) {
      toast({
        title: "No Valid Translations",
        description: "None of the translations are valid for domain names.",
        variant: "destructive",
      });
      return;
    }

    // Create domain combinations
    const newDomains: DomainInfo[] = [];

    validTranslations.forEach(translation => {
      tlds.forEach(tld => {
        const domainName = `${translation.translation.toLowerCase()}.${tld}`;
        newDomains.push({
          domain: domainName,
          status: "checking",
        });
      });
    });

    setDomains(newDomains);
    checkDomainStatus(newDomains);
  };

  // Check the status of each domain
  const checkDomainStatus = async (domainList: DomainInfo[]) => {
    setIsCheckingDomains(true);

    // Process domains sequentially to avoid rate limiting
    for (let i = 0; i < domainList.length; i++) {
      const domain = domainList[i];
      try {
        // Check domain status
        const response = await fetch(`/api/domain-status?domain=${domain.domain}`);
        if (!response.ok) {
          throw new Error(`Failed to check domain status: ${response.statusText}`);
        }

        const statusData = await response.json();

        // Update domain status in the list
        setDomains(prevDomains => {
          const updatedDomains = [...prevDomains];
          updatedDomains[i] = {
            ...updatedDomains[i],
            status: statusData.status,
            registrationDate: statusData.registrationDate,
            message: statusData.message,
          };
          return updatedDomains;
        });

        // If the domain is registered and not registered this month, get traffic data
        if (
          statusData.status === "registered" &&
          statusData.registrationDate
        ) {
          const registrationDate = new Date(statusData.registrationDate);
          const currentDate = new Date();
          const isRegisteredThisMonth =
            registrationDate.getMonth() === currentDate.getMonth() &&
            registrationDate.getFullYear() === currentDate.getFullYear();

          if (!isRegisteredThisMonth) {
            // Get traffic data
            try {
              const trafficResponse = await fetch(`/api/website-traffic?domain=${domain.domain}`);
              if (trafficResponse.ok) {
                const trafficData = await trafficResponse.json();

                // Update domain with traffic data
                setDomains(prevDomains => {
                  const updatedDomains = [...prevDomains];
                  updatedDomains[i] = {
                    ...updatedDomains[i],
                    trafficData,
                  };
                  return updatedDomains;
                });
              }
            } catch (trafficError) {
              console.error(`Failed to get traffic data for ${domain.domain}:`, trafficError);
            }
          }
        }

        // Small delay to avoid overwhelming APIs
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Error checking domain ${domain.domain}:`, error);
        setDomains(prevDomains => {
          const updatedDomains = [...prevDomains];
          updatedDomains[i] = {
            ...updatedDomains[i],
            status: "error",
            message: "Failed to check domain status",
          };
          return updatedDomains;
        });
      }
    }

    setIsCheckingDomains(false);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        i18n.name - Multilingual Domain Scanner
      </h1>
      <p className="text-center mb-10 max-w-2xl mx-auto text-muted-foreground">
        Find available domain names across multiple languages. Enter a keyword and select domain extensions to check availability.
      </p>

      <KeywordForm
        onSubmit={handleKeywordSubmit}
        isLoading={isTranslating}
      />

      <TldSelector
        selectedTlds={selectedTlds}
        onTldChange={handleTldChange}
      />

      <DomainResults
        domains={domains}
        isLoading={isCheckingDomains && domains.length === 0}
      />

      <Toaster />
    </main>
  );
}
