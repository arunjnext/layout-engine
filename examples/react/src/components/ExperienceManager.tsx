import { useState } from 'react';
import { ExperienceForm } from './ExperienceForm';
import type { Position } from '@lib';

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

  const handleUpdateExperience = (index: number, updatedExperience: Position) => {
    const updatedExperiences = experiences.map((exp, i) => 
      i === index ? updatedExperience : exp
    );
    onChange(updatedExperiences);
  };

  const handleRemoveExperience = (index: number) => {
    const experienceId = experiences[index]._id;
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    onChange(updatedExperiences);
    
    // Remove from expanded set
    const newExpandedIds = new Set(expandedIds);
    newExpandedIds.delete(experienceId);
    setExpandedIds(newExpandedIds);
  };

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
    <div className="experience-manager">
      <div className="manager-header">
        <div className="manager-title">
          <h2>Work Experience</h2>
          <span className="experience-count">
            {validExperiencesCount} of {experiences.length} complete
          </span>
        </div>
        <div className="manager-actions">
          {experiences.length > 0 && (
            <>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={handleExpandAll}
              >
                Expand All
              </button>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={handleCollapseAll}
              >
                Collapse All
              </button>
            </>
          )}
        </div>
      </div>

      <div className="experiences-list">
        {experiences.length === 0 ? (
          <div className="empty-state">
            <p>No experiences added yet.</p>
            <p className="empty-state-hint">Click the button below to add your first experience.</p>
          </div>
        ) : (
          experiences.map((experience, index) => (
            <ExperienceForm
              key={experience._id}
              experience={experience}
              onChange={(updated) => handleUpdateExperience(index, updated)}
              onRemove={() => handleRemoveExperience(index)}
              isExpanded={expandedIds.has(experience._id)}
              onToggleExpand={() => handleToggleExpand(experience._id)}
            />
          ))
        )}
      </div>

      <button
        type="button"
        className="btn-add-experience"
        onClick={handleAddExperience}
      >
        + Add New Experience
      </button>

      {experiences.length > 0 && (
        <div className="manager-info">
          <p className="info-text">
            <strong>Tip:</strong> Fill in all required fields (marked with *) to see accurate preview updates.
          </p>
        </div>
      )}
    </div>
  );
}

