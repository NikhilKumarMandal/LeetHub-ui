import type React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { problemById, updateProblem } from "@/http/api";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).optional(),
  examples: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid JSON" }
  ),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid JSON" }
  ),
  codeSnippets: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid JSON" }
  ),
  referenceSolutions: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid JSON" }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const UpdateProblemForm: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [jsonErrors, setJsonErrors] = useState<Record<string, string | null>>(
    {}
  );
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: [],
      examples: "[]",
      constraints: "",
      hints: "",
      editorial: "",
      testcases: "[]",
      codeSnippets: "[]",
      referenceSolutions: "[]",
    },
  });

  // Fetch problem by id
  const { error } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: async () => {
      try {
        const data = await problemById(problemId!).then((res) => res.data);
        console.log("API response:", data);

        // Format the data for the form
        const formattedData = {
          title: data.data.title || "",
          description: data.data.description || "",
          difficulty: data.data.difficulty || "EASY",
          tags: Array.isArray(data.data.topic) ? data.data.topic : [],
          examples:
            typeof data.data.examples === "string"
              ? data.data.examples
              : JSON.stringify(data.data.examples || [], null, 2),
          testcases:
            typeof data.data.testcases === "string"
              ? data.data.testcases
              : JSON.stringify(data.data.testcases || [], null, 2),
          codeSnippets:
            typeof data.data.codeSnippets === "string"
              ? data.data.codeSnippets
              : JSON.stringify(data.data.codeSnippets || [], null, 2),
          referenceSolutions:
            typeof data.data.referenceSolutions === "string"
              ? data.data.referenceSolutions
              : JSON.stringify(data.data.referenceSolutions || [], null, 2),
          constraints: data.data.constraints || "",
          hints: data.data.hints || "",
          editorial: data.data.editorial || "",
        };

        console.log("Formatted data:", formattedData);
        setFormData(formattedData);

        // Set form values directly
        Object.entries(formattedData).forEach(([key, value]) => {
          form.setValue(key as any, value);
        });

        return data;
      } catch (error) {
        console.error("Error fetching problem:", error);
        throw error;
      }
    },
    enabled: !!problemId,
  });

  // This ensures the form is updated when formData changes
  useEffect(() => {
    if (formData) {
      console.log("Setting form values from formData:", formData);

      // Reset the form with the formatted data
      form.reset(formData);

      // Also set each field individually to ensure they're updated
      Object.entries(formData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [formData, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateProblem", problemId],
    mutationFn: (data: FormValues) => updateProblem(problemId!, data),
    onSuccess: () => {
      setJsonErrors({});
      alert("Problem updated successfully!");
    },
    onError: (error: any) => {
      console.error("Update failed", error);
      alert("Failed to update problem.");
    },
  });

  const onSubmit = (data: FormValues) => {
    const fieldsToCheck = [
      "examples",
      "testcases",
      "codeSnippets",
      "referenceSolutions",
    ] as const;

    for (const field of fieldsToCheck) {
      try {
        JSON.parse(data[field]);
        setJsonErrors((prev) => ({ ...prev, [field]: null }));
      } catch {
        setJsonErrors((prev) => ({ ...prev, [field]: "Invalid JSON" }));
        return;
      }
    }

    const payload = {
      ...data,
      examples: JSON.parse(data.examples),
      testcases: JSON.parse(data.testcases),
      codeSnippets: JSON.parse(data.codeSnippets),
      referenceSolutions: JSON.parse(data.referenceSolutions),
    };

    mutate(payload);
  };

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading problem: {(error as Error).message}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto p-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <select {...field} className="w-full border rounded px-2 py-1">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input
                  value={field.value?.join(",") || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {["examples", "testcases", "codeSnippets", "referenceSolutions"].map(
          (fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldName}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
                        try {
                          JSON.parse(value);
                          setJsonErrors((prev) => ({
                            ...prev,
                            [fieldName]: null,
                          }));
                        } catch {
                          setJsonErrors((prev) => ({
                            ...prev,
                            [fieldName]: "Invalid JSON",
                          }));
                        }
                      }}
                    />
                  </FormControl>
                  {jsonErrors[fieldName] && (
                    <p className="text-red-500 text-sm">
                      {jsonErrors[fieldName]}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        )}

        <FormField
          control={form.control}
          name="constraints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Constraints</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hints</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="editorial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Editorial</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Problem"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProblemForm;
