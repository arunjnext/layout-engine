import type { Education, Position, Skill } from '../types/resume';

/**
 * Component Factory - Creates DOM elements for resume sections
 */
export class ComponentFactory {
  /**
   * Create experience/position component
   */
  createPositionComponent(position: Position): HTMLElement {
    const container = document.createElement('div');
    container.className = 'resume-position';
    container.dataset.positionId = position._id;
    
    // Mark as split if applicable
    if (position._isPartial) {
      container.dataset.isPartial = 'true';
    }
    if (position._splitContinuation) {
      container.dataset.splitContinuation = 'true';
    }

    // Title section (only show on first page, not on continuation)
    if (!position._splitContinuation) {
      const titleSection = document.createElement('div');
      titleSection.className = 'position-title-section';

      const title = document.createElement('h3');
      title.className = 'position-title';
      title.textContent = position.title;
      titleSection.appendChild(title);

      const company = document.createElement('span');
      company.className = 'position-company';
      company.textContent = ` at ${position.company}`;
      titleSection.appendChild(company);

      if (position.startDate || position.endDate) {
        const dates = document.createElement('span');
        dates.className = 'position-dates';
        const dateRange = position.endDate
          ? `${position.startDate} - ${position.endDate}`
          : `${position.startDate} - Present`;
        dates.textContent = ` (${dateRange})`;
        titleSection.appendChild(dates);
      }

      container.appendChild(titleSection);
    }

    // Intro section (only if present and not continuation)
    if (position.intro && !position._splitContinuation) {
      const intro = document.createElement('div');
      intro.className = 'position-intro';
      intro.textContent = position.intro;
      container.appendChild(intro);
    }
    
    // Statements/description
    if (position.description && position.description.length > 0) {
      const statementsList = document.createElement('ul');
      statementsList.className = 'position-statements';
      
      // Calculate starting index for continuation
      const startIndex = position._splitIndexes?.statementsStartIndex || 0;
      
      position.description.forEach((statement, index) => {
        const li = document.createElement('li');
        li.className = 'position-statement';
        li.textContent = statement;
        li.dataset.statementIndex = (startIndex + index).toString();
        statementsList.appendChild(li);
      });
      
      container.appendChild(statementsList);
    }
    
    return container;
  }
  
  /**
   * Create education component
   */
  createEducationComponent(education: Education): HTMLElement {
    const container = document.createElement('div');
    container.className = 'resume-education';
    container.dataset.educationId = education._id;
    
    // Mark as split if applicable
    if (education._isPartial) {
      container.dataset.isPartial = 'true';
    }
    if (education._splitContinuation) {
      container.dataset.splitContinuation = 'true';
    }

    // Header section (only show on first page, not on continuation)
    if (!education._splitContinuation) {
      const degree = document.createElement('h3');
      degree.className = 'education-degree';
      degree.textContent = education.degree;
      container.appendChild(degree);

      const institution = document.createElement('div');
      institution.className = 'education-institution';
      institution.textContent = education.institution;
      if (education.year) {
        institution.textContent += ` (${education.year})`;
      }
      container.appendChild(institution);
    }
    
    if (education.description && education.description.length > 0) {
      const descriptionList = document.createElement('ul');
      descriptionList.className = 'education-description';
      
      // Calculate starting index for continuation
      const startIndex = education._splitIndexes?.statementsStartIndex || 0;
      
      education.description.forEach((desc, index) => {
        const li = document.createElement('li');
        li.textContent = desc;
        li.dataset.statementIndex = (startIndex + index).toString();
        descriptionList.appendChild(li);
      });
      container.appendChild(descriptionList);
    }
    
    return container;
  }
  
  /**
   * Create skills component
   */
  createSkillsComponent(skills: Skill[]): HTMLElement {
    const container = document.createElement('div');
    container.className = 'resume-skills';
    
    const skillsGrid = document.createElement('div');
    skillsGrid.className = 'skills-grid';
    skillsGrid.style.display = 'grid';
    skillsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
    skillsGrid.style.gap = '10px';
    
    skills.forEach(skill => {
      const skillTag = document.createElement('span');
      skillTag.className = 'skill-tag';
      skillTag.textContent = skill.name;
      skillTag.style.cssText = `
        padding: 5px 10px;
        background: #f0f0f0;
        border-radius: 4px;
        display: inline-block;
      `;
      skillsGrid.appendChild(skillTag);
    });
    
    container.appendChild(skillsGrid);
    return container;
  }
}

