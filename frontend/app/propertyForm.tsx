"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber, toTitleCase } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PropertyFormProps {
  regions: string[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const TYPES = [
  "Apartment",
  "Villa",
  "Studio Apartment",
  "Independent House",
  "Penthouse",
];

const PropertyFormSchema = z.object({
  bhk: z.string().min(1, "BHK must be at least 1"),
  area: z.string().min(1, "Area must be at least 1"),
  region: z.string().min(1, "Region is required"),
  type: z.enum(
    [
      "Apartment",
      "Villa",
      "Studio Apartment",
      "Independent House",
      "Penthouse",
    ],
    {
      errorMap: () => ({ message: "Type is required" }),
    }
  ),
});

export default function PropertyForm({ regions }: PropertyFormProps) {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof PropertyFormSchema>>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      type: "Apartment",
    },
  });

  function onSubmit(values: z.infer<typeof PropertyFormSchema>) {
    setLoading(true);
    setError(null);
    setEstimatedPrice(null);
    const { bhk, area, region, type } = values;
    const payload = {
      bhk: parseInt(bhk, 10),
      area: parseInt(area, 10),
      region,
      type,
    };
    const res = fetch(`${BACKEND_URL}/estimate-price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    res
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          console.log("Estimated Price:", data);
          setEstimatedPrice(data.estimated_price);
          setError(null);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to estimate price. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
        <div className="flex gap-8">
          <FormField
            control={form.control}
            name="bhk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BHK</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area in sqaure feet</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select the location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {toTitleCase(region)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of property</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2Icon className="animate-spin size-4" />}{" "}
            Estimate Price
          </Button>
        </div>
      </form>
      {estimatedPrice !== null && (
        <p className="text-center text-green-600 mt-4">
          Estimated Price: {formatNumber(estimatedPrice)}
        </p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}
    </Form>
  );
}
