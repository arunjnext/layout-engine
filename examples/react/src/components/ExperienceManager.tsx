import { useCallback, useState } from 'react';
import { ExperienceForm } from './ExperienceForm';
import type { Position } from '@lib';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Maximize2, Minimize2 } from 'lucide-react';

interface ExperienceManagerProps {
  experiences: Position[];
  onChange: (experiences: Position[]) => void;
}

export function ExperienceManager({ experiences, onChange }: ExperienceManagerProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleAddExperience = () => {
    const newExperience: Position = {
      _id: crypto.randomUUID(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      intro: '',
      description: []
    };
    
    // Add new experience and expand it
    const updatedExperiences = [...experiences, newExperience];
    onChange(updatedExperiences);
    setExpandedIds(new Set([...expandedIds, newExperience._id]));
  };

  const handleUpdateExperience = useCallback((updatedExperience: Position) => {
    const updatedExperiences = experiences.map((exp) => 
      exp._id === updatedExperience._id ? updatedExperience : exp
    );
    onChange(updatedExperiences);
  }, [experiences, onChange]);

  const handleRemoveExperience = useCallback((experienceId: string) => {
    const updatedExperiences = experiences.filter((exp) => exp._id !== experienceId);
    onChange(updatedExperiences);
    
    // Remove from expanded set
    const newExpandedIds = new Set(expandedIds);
    newExpandedIds.delete(experienceId);
    setExpandedIds(newExpandedIds);
  }, [experiences, onChange, expandedIds]);

  const handleToggleExpand = (experienceId: string) => {
    const newExpandedIds = new Set(expandedIds);
    if (newExpandedIds.has(experienceId)) {
      newExpandedIds.delete(experienceId);
    } else {
      newExpandedIds.add(experienceId);
    }
    setExpandedIds(newExpandedIds);
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(experiences.map(exp => exp._id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const validExperiencesCount = experiences.filter(exp => 
    exp.title?.trim() && 
    exp.company?.trim() && 
    exp.startDate?.trim() && 
    exp.endDate?.trim() && 
    exp.intro?.trim()
  ).length;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl flex items-center gap-3">
              Work Experience
              <Badge variant="secondary" className="text-sm font-semibold">
                {validExperiencesCount} of {experiences.length} complete
              </Badge>
            </CardTitle>
            <CardDescription className="text-base">
              Add and manage your work experiences
            </CardDescription>
          </div>
          {experiences.length > 0 && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExpandAll}
                className="gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                Expand All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCollapseAll}
                className="gap-2"
              >
                <Minimize2 className="h-4 w-4" />
                Collapse All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-lg text-muted-foreground">No experiences added yet.</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to add your first experience.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <ExperienceForm
                key={experience._id}
                experience={experience}
                onChange={handleUpdateExperience}
                onRemove={() => handleRemoveExperience(experience._id)}
                isExpanded={expandedIds.has(experience._id)}
                onToggleExpand={() => handleToggleExpand(experience._id)}
              />
            ))}
          </div>
        )}

        <Button
          type="button"
          onClick={handleAddExperience}
          className="w-full bg-linear-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-lg hover:shadow-xl transition-all gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Add New Experience
        </Button>

        {experiences.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-foreground">
              <strong className="text-blue-600 dark:text-blue-400">Tip:</strong> Fill in all required 
              fields (marked with <span className="text-destructive">*</span>) to see accurate preview updates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
