import { zodResolver } from "@hookform/resolvers/zod";
import type { Position } from "resume-layout-engine";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  experienceSchema,
  type ExperienceFormData,
} from "../schemas/experienceSchema";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ExperienceFormProps {
  experience: Position;
  onChange: (experience: Position) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function ExperienceForm({
  experience,
  onChange,
  onRemove,
  isExpanded,
  onToggleExpand,
}: ExperienceFormProps) {
  const {
    register,
    control,
    formState: { errors, isValid, touchedFields },
    watch,
    reset,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    mode: "onChange",
    defaultValues: {
      _id: experience._id,
      title: experience.title || "",
      company: experience.company || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      intro: experience.intro || "",
      description: experience.description || [],
    },
  });

  // useFieldArray for dynamic description/achievements management
  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error - Type system conflict between Zod and useFieldArray for array fields
    name: "description",
  });

  // Stabilize onChange callback with useRef to prevent infinite loops
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Reset form when switching between different experiences (not on every field change)
  useEffect(() => {
    reset(
      {
        _id: experience._id,
        title: experience.title || "",
        company: experience.company || "",
        startDate: experience.startDate || "",
        endDate: experience.endDate || "",
        intro: experience.intro || "",
        description: experience.description || [],
      },
      {
        keepDefaultValues: false, // Important for useFieldArray to properly update
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience._id, reset]); // Only reset when experience ID changes, not on field updates

  // Watch form values and propagate changes to parent using subscription
  useEffect(() => {
    const subscription = watch((value) => {
      onChangeRef.current(value as Position);
    });
    return () => subscription.unsubscribe();
  }, [watch]); // watch is stable from useForm

  const hasTouchedFields = Object.keys(touchedFields).length > 0;
  const showValidBadge = isValid && hasTouchedFields;
  const showInvalidBadge = !isValid && hasTouchedFields;

  return (
    <div
      key={experience._id}
      className="border-2 border-border rounded-lg overflow-hidden transition-all hover:border-primary/50 hover:shadow-md bg-card"
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-background hover:bg-accent/50 transition-colors select-none"
        onClick={onToggleExpand}
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {experience.title || "New Experience"}
          </h3>
          <span className="text-sm font-medium text-primary">
            {experience.company || "Company"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showValidBadge && (
            <Badge
              variant="default"
              className="bg-green-500 hover:bg-green-600"
            >
              ✓
            </Badge>
          )}
          {showInvalidBadge && <Badge variant="destructive">!</Badge>}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 border-t-2 border-border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label
                htmlFor={`title-${experience._id}`}
                className="text-sm font-semibold"
              >
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`title-${experience._id}`}
                {...register("title")}
                placeholder="e.g. Senior Software Engineer"
                className={
                  errors.title
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.title && (
                <p className="text-sm text-destructive font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`company-${experience._id}`}
                className="text-sm font-semibold"
              >
                Company <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`company-${experience._id}`}
                {...register("company")}
                placeholder="e.g. Tech Innovations Inc."
                className={
                  errors.company
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.company && (
                <p className="text-sm text-destructive font-medium">
                  {errors.company.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label
                htmlFor={`startDate-${experience._id}`}
                className="text-sm font-semibold"
              >
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`startDate-${experience._id}`}
                {...register("startDate")}
                placeholder="e.g. 2021-06 or Jan 2021"
                className={
                  errors.startDate
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.startDate && (
                <p className="text-sm text-destructive font-medium">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`endDate-${experience._id}`}
                className="text-sm font-semibold"
              >
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`endDate-${experience._id}`}
                {...register("endDate")}
                placeholder="e.g. 2024-12 or Present"
                className={
                  errors.endDate
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.endDate && (
                <p className="text-sm text-destructive font-medium">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <Label
              htmlFor={`intro-${experience._id}`}
              className="text-sm font-semibold"
            >
              Introduction <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`intro-${experience._id}`}
              {...register("intro")}
              placeholder="Brief summary of your role and key responsibilities..."
              rows={3}
              className={
                errors.intro
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.intro && (
              <p className="text-sm text-destructive font-medium">
                {errors.intro.message}
              </p>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <Label className="text-sm font-semibold">
              Key Achievements{" "}
              <span className="text-muted-foreground italic font-normal">
                (optional)
              </span>
            </Label>
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {fields.map((field: any, index: number) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <Textarea
                    {...register(`description.${index}` as const)}
                    placeholder={`Achievement ${index + 1}...`}
                    rows={2}
                    className="flex-1 resize-none"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label="Remove bullet"
                    className="shrink-0 h-10 w-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
              className="w-full border-dashed border-2 hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </div>

          <div className="pt-6 border-t-2 border-border">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Remove Experience
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
