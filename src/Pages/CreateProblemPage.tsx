import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { createProblem } from "@/http/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topic: z
    .array(z.object({ value: z.string().min(1, "Topic is required") }))
    .min(1),
  constraints: z.array(z.object({ value: z.string() })).optional(),
  hints: z.array(z.object({ value: z.string() })).optional(),
  companyName: z.array(z.object({ value: z.string() })).optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        isPublic: z.boolean(),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().optional(),
      })
    )
    .min(1, "At least one example is required"),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  starterFunction: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const problem = async (payload: any) => {
  const { data } = await createProblem(payload);
  return data;
};

function CreateProblemPage() {
  const navigation = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      topic: [{ value: "" }],
      constraints: [{ value: "" }],
      hints: [{ value: "" }],
      companyName: [{ value: "" }],
      examples: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
      starterFunction: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  type Language = "JAVASCRIPT" | "PYTHON" | "JAVA";
  const languages: Language[] = ["JAVASCRIPT", "PYTHON", "JAVA"];
  const {
    fields: testcaseField,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "topic",
  });

  const {
    fields: constraintsFields,
    append: appendConstraints,
    remove: removeConstraints,
    replace: replaceConstraints,
  } = useFieldArray({
    control,
    name: "constraints",
  });

  const {
    fields: hintsFields,
    append: appendHints,
    remove: removeHints,
    replace: replaceHints,
  } = useFieldArray({
    control,
    name: "hints",
  });

  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control,
    name: "examples",
  });

  const {
    fields: companyNameFields,
    append: appendCompanyName,
    remove: removeCompanyName,
  } = useFieldArray({
    control,
    name: "companyName",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["problem"],
    mutationFn: problem,
    onSuccess: () => {
      toast.success("Problem created successfully");
      navigation("/auth/problen");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: any) => {
    const transformedData = {
      ...data,
      hints: data.hints.map((hint: { value: string }) => hint.value),
      topic: data.topic.map((topi: { value: string }) => topi.value),
      constraints: data.constraints.map(
        (constraint: { value: string }) => constraint.value
      ),
      companyName: data.companyName.map(
        (companyNam: { value: string }) => companyNam.value
      ),
    };

    mutate(transformedData);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl bg-white text-black">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 md:p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b">
            <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Create Problem
            </h2>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control md:col-span-2">
                <label className="label" htmlFor="title">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Title
                  </span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="input input-bordered w-full text-base md:text-lg"
                  {...register("title")}
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.title.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control md:col-span-2">
                <label className="label" htmlFor="description">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Description
                  </span>
                </label>
                <textarea
                  id="description"
                  className="textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y"
                  {...register("description")}
                  placeholder="Enter problem description"
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.description.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="difficulty">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Difficulty
                  </span>
                </label>
                <select
                  id="difficulty"
                  className="select select-bordered w-full text-base md:text-lg"
                  {...register("difficulty")}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                {errors.difficulty && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.difficulty.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Tags */}
            <section className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Topic
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendTopic({ value: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topicFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      {...register(`topic.${index}.value` as const)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm"
                      onClick={() => removeTopic(index)}
                      disabled={topicFields.length === 1}
                      aria-label="Remove tag"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.topic && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.topic.message}
                  </span>
                </div>
              )}
            </section>

            <section className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Constraints
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendConstraints({ value: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {constraintsFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      {...register(`constraints.${index}.value` as const)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm"
                      onClick={() => removeConstraints(index)}
                      disabled={constraintsFields.length === 1}
                      aria-label="Remove tag"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.constraints && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.constraints.message}
                  </span>
                </div>
              )}
            </section>

            <section className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  CompanyName
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendCompanyName({ value: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Company
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyNameFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      {...register(`companyName.${index}.value` as const)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm"
                      onClick={() => removeCompanyName(index)}
                      disabled={companyNameFields.length === 1}
                      aria-label="Remove tag"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.companyName && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.companyName.message}
                  </span>
                </div>
              )}
            </section>

            <section className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Hints
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendHints({ value: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Hints
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hintsFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1"
                      {...register(`hints.${index}.value` as const)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm"
                      onClick={() => removeHints(index)}
                      disabled={hintsFields.length === 1}
                      aria-label="Remove tag"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.hints && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.hints.message}
                  </span>
                </div>
              )}
            </section>

            {/* Test Cases */}
            <section className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Test Cases
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    appendTestCase({ input: "", output: "", isPublic: false })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </button>
              </div>
              <div className="space-y-6">
                {testcaseField.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base md:text-lg font-semibold">
                          Test Case #{index + 1}
                        </h4>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => removeTestCase(index)}
                          disabled={testcaseField.length === 1}
                          aria-label={`Remove test case #${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="form-control">
                          <label
                            className="label"
                            htmlFor={`testcases.${index}.input`}
                          >
                            <span className="label-text font-medium">
                              Input
                            </span>
                          </label>
                          <textarea
                            id={`testcases.${index}.input`}
                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                            {...register(`testcases.${index}.input` as const)}
                            placeholder="Enter test case input"
                          />
                          {errors.testcases?.[index]?.input && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.testcases[index].input?.message}
                              </span>
                            </label>
                          )}
                        </div>

                        <div className="form-control">
                          <label
                            className="label"
                            htmlFor={`testcases.${index}.output`}
                          >
                            <span className="label-text font-medium">
                              Expected Output
                            </span>
                          </label>
                          <textarea
                            id={`testcases.${index}.output`}
                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                            {...register(`testcases.${index}.output` as const)}
                            placeholder="Enter expected output"
                          />
                          {errors.testcases?.[index]?.output && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.testcases[index].output?.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="form-control mt-4 flex items-center gap-2">
                        <input
                          id={`testcases.${index}.isPublic`}
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          {...register(`testcases.${index}.isPublic` as const)}
                        />
                        <label
                          htmlFor={`testcases.${index}.isPublic`}
                          className="font-medium select-none"
                        >
                          Public Test Case
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.testcases && !Array.isArray(errors.testcases) && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.testcases.message}
                  </span>
                </div>
              )}
            </section>

            {/* Code Editor Sections */}
            <section className="space-y-8">
              {languages.map((language) => (
                <div
                  key={language}
                  className="card bg-base-200 p-4 md:p-6 shadow-md"
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    {language}
                  </h3>

                  {/* Starter Code */}
                  <div className="card bg-base-100 shadow-md mb-6">
                    <div className="card-body p-4 md:p-6">
                      <h4 className="font-semibold text-base md:text-lg mb-4">
                        Starter Code Template
                      </h4>
                      <div className="border rounded-md overflow-hidden">
                        <Controller
                          name={`codeSnippets.${language}` as const}
                          control={control}
                          render={({ field }) => (
                            <Editor
                              height="300px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                              }}
                            />
                          )}
                        />
                      </div>
                      {(errors.codeSnippets as any)?.[language]?.message && (
                        <div className="mt-2">
                          <span className="text-error text-sm">
                            {(errors.codeSnippets as any)[language].message}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reference Solution */}
                  <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        Reference Solution
                      </h4>
                      <div className="border rounded-md overflow-hidden">
                        <Controller
                          name={`referenceSolutions.${language}` as const}
                          control={control}
                          render={({ field }) => (
                            <Editor
                              height="300px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                              }}
                            />
                          )}
                        />
                      </div>
                      {(errors.referenceSolutions as any)?.[language]
                        ?.message && (
                        <div className="mt-2">
                          <span className="text-error text-sm">
                            {
                              (errors.referenceSolutions as any)[language]
                                .message
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* starter function */}
                  <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        Stater Function
                      </h4>
                      <div className="border rounded-md overflow-hidden">
                        <Controller
                          name={`starterFunction.${language}` as const}
                          control={control}
                          render={({ field }) => (
                            <Editor
                              height="300px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                              }}
                            />
                          )}
                        />
                      </div>
                      {(errors.starterFunction as any)?.[language]?.message && (
                        <div className="mt-2">
                          <span className="text-error text-sm">
                            {(errors.starterFunction as any)[language].message}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <div className="card bg-base-100 shadow-md">
              <div className="card-body p-4 md:p-6">
                <h4 className="font-semibold text-base md:text-lg mb-4">
                  Examples
                </h4>
                {exampleFields.map((field, index) => (
                  <div key={field.id} className="mb-6 border p-4 rounded-md">
                    <h5 className="font-semibold mb-2">Example {index + 1}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="form-control">
                        <label className="label">Input</label>
                        <textarea
                          className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                          {...register(`examples.${index}.input`)}
                          placeholder="Example input"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">Output</label>
                        <textarea
                          className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                          {...register(`examples.${index}.output`)}
                          placeholder="Example output"
                        />
                      </div>
                      <div className="form-control md:col-span-2">
                        <label className="label">Explanation</label>
                        <textarea
                          className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                          {...register(`examples.${index}.explanation`)}
                          placeholder="Explain the example"
                        />
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => removeExample(index)}
                          disabled={exampleFields.length === 1}
                        >
                          Remove Example
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    appendExample({ input: "", output: "", explanation: "" })
                  }
                >
                  Add Example
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <section className="card bg-base-200 p-4 md:p-6 shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                Additional Information
              </h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label" htmlFor="editorial">
                    <span className="label-text font-medium">Editorial</span>
                  </label>
                  <textarea
                    id="editorial"
                    className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                    {...register("editorial")}
                    placeholder="Enter editorial or solution explanation"
                  />
                  {errors.editorial && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.editorial.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className={`btn btn-primary btn-lg ${isPending ? "loading" : ""}`}
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Problem"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProblemPage;
