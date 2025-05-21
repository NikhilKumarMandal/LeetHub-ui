import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProblem } from "@/http/api"; // Your API call
import type { ProblemData } from "@/Types";

// Validation schema with Zod
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topic: z.array(z.string().min(1)).min(1, "At least one topic is required"),
  companyName: z.array(z.string().min(1)).optional(),
  examples: z.any(),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z.any(),
  codeSnippets: z.any(),
  referenceSolutions: z.any(),
});

type FormValues = z.infer<typeof formSchema>;

// Updated mutation function expects wrapped data
const problem = async (payload: ProblemData) => {
  const { data } = await createProblem(payload);
  return data;
};

const TagsInput = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        {value.map((tag, i) => (
          <div
            key={i}
            className="bg-muted px-2 py-1 rounded flex items-center gap-1"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Enter tag and press Enter"
        />
        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>
    </div>
  );
};

const CreateProblemForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      topic: [],
      companyName: [],
      constraints: "",
      hints: "",
      editorial: "",
      examples: {},
      testcases: [],
      codeSnippets: {},
      referenceSolutions: {},
    },
  });

  // State to hold JSON input errors for each JSON field
  const [jsonErrors, setJsonErrors] = useState<Record<string, string | null>>(
    {}
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["problem"],
    mutationFn: problem,
    onSuccess: () => {
      toast.success("Problem created successfully");
      form.reset();
      setJsonErrors({});
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  // Submit handler with JSON error check and data transformation
  //   const onSubmit = (data: FormValues) => {
  //     const hasJsonErrors = Object.values(jsonErrors).some((error) => error !== null);
  //     if (hasJsonErrors) {
  //       toast.error("Please fix JSON errors before submitting.");
  //       return;
  //     }

  //     // Transform and clean data before sending
  //     const problemData: ProblemData = {
  //       title: data.title,
  //       description: data.description,
  //       difficulty: data.difficulty,
  //       topic: data.topic,
  //       companyName: data.companyName?.filter(Boolean) || [],
  //       examples: data.examples || {},
  //       constraints: data.constraints,
  //       hints: data.hints || "",
  //       editorial: data.editorial || "",
  //       testcases: data.testcases || [],
  //       codeSnippets: data.codeSnippets || {},
  //       referenceSolutions: data.referenceSolutions || {},
  //     };

  //     mutate({ problemData });

  //     console.log("Submitting problem data:", problemData);
  //   };

  const onSubmit = (data: FormValues) => {
    const hasJsonErrors = Object.values(jsonErrors).some(
      (error) => error !== null
    );
    if (hasJsonErrors) {
      toast.error("Please fix JSON errors before submitting.");
      return;
    }
    // your data transformation here
    const problemData: ProblemData = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      topic: data.topic,
      companyName: data.companyName?.filter(Boolean) || [],
      examples: data.examples || {},
      constraints: data.constraints,
      hints: data.hints || "",
      editorial: data.editorial || "",
      testcases: data.testcases || [],
      codeSnippets: data.codeSnippets || {},
      referenceSolutions: data.referenceSolutions || {},
    };

    mutate(data);
  };

  const jsonFields = [
    "examples",
    "testcases",
    "codeSnippets",
    "referenceSolutions",
  ] as (keyof FormValues)[];

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
                <Textarea rows={4} {...field} />
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
                <select
                  {...field}
                  className="w-full border rounded px-2 py-1 bg-black"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <TagsInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="constraints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Constraints</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
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
                <Textarea rows={2} {...field} />
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
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {jsonFields.map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => {
              const [localValue, setLocalValue] = React.useState(() =>
                field.value ? JSON.stringify(field.value, null, 2) : "{}"
              );

              const error = jsonErrors[fieldName];

              return (
                <FormItem>
                  <FormLabel>{fieldName}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={`Paste valid JSON for ${fieldName}`}
                      value={localValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLocalValue(val);

                        try {
                          const parsed = JSON.parse(val);
                          field.onChange(parsed);
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
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Submitting..." : "Create Problem"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateProblemForm;
