"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DomainInfo, TrafficData } from "@/types";

interface DomainResultsProps {
  domains: DomainInfo[];
  isLoading: boolean;
}

export function DomainResults({ domains, isLoading }: DomainResultsProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (domains.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-5xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Domain Availability Results</CardTitle>
        <CardDescription>
          Check the status of each domain name across multiple languages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Traffic (3 months)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.domain}>
                <TableCell className="font-medium">{domain.domain}</TableCell>
                <TableCell>
                  <StatusBadge status={domain.status} />
                </TableCell>
                <TableCell>
                  {domain.registrationDate
                    ? new Date(domain.registrationDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {domain.trafficData ? (
                    <TrafficDisplay trafficData={domain.trafficData} />
                  ) : (
                    domain.status === "registered" ? (
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    ) : "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Status badge component
function StatusBadge({ status }: { status: DomainInfo["status"] }) {
  switch (status) {
    case "available":
      return <Badge className="bg-green-500">Available</Badge>;
    case "registered":
      return <Badge variant="outline">Registered</Badge>;
    case "checking":
      return <Badge variant="secondary">Checking...</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    case "unknown":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Unknown</Badge>;
    default:
      return null;
  }
}

// Traffic display component
function TrafficDisplay({ trafficData }: { trafficData: TrafficData }) {
  const totalVisits = trafficData.metrics.reduce((sum, metric) => sum + metric.visits, 0);

  return (
    <div className="text-sm">
      <span className="font-medium">{totalVisits.toLocaleString()}</span>
      <span className="text-muted-foreground ml-1">visitors</span>
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <Card className="w-full max-w-5xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Domain Availability Results</CardTitle>
        <CardDescription>
          Checking domain availability...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Traffic (3 months)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
