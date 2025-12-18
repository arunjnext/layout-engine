import { useState, useEffect } from 'react';
import type { Position } from '@lib';

interface ExperienceFormProps {
  experience: Position;
  onChange: (experience: Position) => void;
  onRemove: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface ValidationErrors {
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  intro?: string;
}

export function ExperienceForm({
  experience,
  onChange,
  onRemove,
  isExpanded,
  onToggleExpand
}: ExperienceFormProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!experience.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!experience.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!experience.startDate?.trim()) {
      newErrors.startDate = 'Start date is required';
    }

    if (!experience.endDate?.trim()) {
      newErrors.endDate = 'End date is required';
    }

    if (!experience.intro?.trim()) {
      newErrors.intro = 'Intro is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate on change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validate();
    }
  }, [experience, touched]);

  const handleFieldChange = (field: keyof Position, value: string) => {
    setTouched({ ...touched, [field]: true });
    onChange({ ...experience, [field]: value });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescription = [...(experience.description || [])];
    newDescription[index] = value;
    onChange({ ...experience, description: newDescription });
  };

  const addDescriptionBullet = () => {
    const newDescription = [...(experience.description || []), ''];
    onChange({ ...experience, description: newDescription });
  };

  const removeDescriptionBullet = (index: number) => {
    const newDescription = (experience.description || []).filter((_, i) => i !== index);
    onChange({ ...experience, description: newDescription });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0;

  return (
    <div className="experience-card">
      <div className="experience-card-header" onClick={onToggleExpand}>
        <div className="experience-card-title">
          <h3>{experience.title || 'New Experience'}</h3>
          <span className="experience-card-company">{experience.company || 'Company'}</span>
        </div>
        <div className="experience-card-actions">
          {isValid && <span className="validation-badge valid">✓</span>}
          {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
            <span className="validation-badge invalid">!</span>
          )}
          <button
            type="button"
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="experience-card-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`title-${experience._id}`}>
                Job Title <span className="required">*</span>
              </label>
              <input
                id={`title-${experience._id}`}
                type="text"
                value={experience.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                className={errors.title && touched.title ? 'error' : ''}
                placeholder="e.g. Senior Software Engineer"
              />
              {errors.title && touched.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`company-${experience._id}`}>
                Company <span className="required">*</span>
              </label>
              <input
                id={`company-${experience._id}`}
                type="text"
                value={experience.company || ''}
                onChange={(e) => handleFieldChange('company', e.target.value)}
                onBlur={() => handleBlur('company')}
                className={errors.company && touched.company ? 'error' : ''}
                placeholder="e.g. Tech Innovations Inc."
              />
              {errors.company && touched.company && (
                <span className="error-message">{errors.company}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`startDate-${experience._id}`}>
                Start Date <span className="required">*</span>
              </label>
              <input
                id={`startDate-${experience._id}`}
                type="text"
                value={experience.startDate || ''}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                onBlur={() => handleBlur('startDate')}
                className={errors.startDate && touched.startDate ? 'error' : ''}
                placeholder="e.g. 2021-06 or Jan 2021"
              />
              {errors.startDate && touched.startDate && (
                <span className="error-message">{errors.startDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`endDate-${experience._id}`}>
                End Date <span className="required">*</span>
              </label>
              <input
                id={`endDate-${experience._id}`}
                type="text"
                value={experience.endDate || ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                onBlur={() => handleBlur('endDate')}
                className={errors.endDate && touched.endDate ? 'error' : ''}
                placeholder="e.g. 2024-12 or Present"
              />
              {errors.endDate && touched.endDate && (
                <span className="error-message">{errors.endDate}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`intro-${experience._id}`}>
              Introduction <span className="required">*</span>
            </label>
            <textarea
              id={`intro-${experience._id}`}
              value={experience.intro || ''}
              onChange={(e) => handleFieldChange('intro', e.target.value)}
              onBlur={() => handleBlur('intro')}
              className={errors.intro && touched.intro ? 'error' : ''}
              placeholder="Brief summary of your role and key responsibilities..."
              rows={3}
            />
            {errors.intro && touched.intro && (
              <span className="error-message">{errors.intro}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Key Achievements <span className="optional">(optional)</span>
            </label>
            <div className="description-bullets">
              {(experience.description || []).map((bullet, index) => (
                <div key={index} className="bullet-item">
                  <textarea
                    value={bullet}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    placeholder={`Achievement ${index + 1}...`}
                    rows={2}
                  />
                  <button
                    type="button"
                    className="btn-remove-bullet"
                    onClick={() => removeDescriptionBullet(index)}
                    aria-label="Remove bullet"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-add-bullet"
              onClick={addDescriptionBullet}
            >
              + Add Achievement
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-remove"
              onClick={onRemove}
            >
              Remove Experience
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

