import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    User,
    Briefcase,
    GraduationCap,
    Award,
    Lightbulb,
    Languages as LanguagesIcon,
    FileText
} from 'lucide-react';
import PersonalDetails from '../../components/forms/PersonalDetails';
import Summary from '../../components/forms/Summary';
import Experience from '../../components/forms/Experience';
import Education from '../../components/forms/Education';
import Skills from '../../components/forms/Skills';
import Languages from '../../components/forms/Languages';
import Certifications from '../../components/forms/Certifications';

const ResumeSidebarWithForms = ({ resumeInfo, isTemplate2 }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const [enableNext, setEnableNext] = useState(false);

    // Define sections based on template
    const sections = [
        { id: 1, key: 'basic-details', label: 'Basic Details', icon: User, component: PersonalDetails },
        { id: 2, key: 'summary', label: 'Summary', icon: FileText, component: Summary },
        { id: 3, key: 'experience', label: 'Experience', icon: Briefcase, component: Experience },
        { id: 4, key: 'education', label: 'Education', icon: GraduationCap, component: Education },
        { id: 5, key: 'skills', label: 'Skills & Expertise', icon: Lightbulb, component: Skills },
    ];

    // Add template 2 specific sections
    if (isTemplate2) {
        sections.push(
            { id: 6, key: 'certifications', label: 'Certificates', icon: Award, component: Certifications },
            { id: 7, key: 'languages', label: 'Languages', icon: LanguagesIcon, component: Languages }
        );
    }

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    return (
        <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-gray-800">Resume Builder</h2>
                <p className="text-xs text-gray-500 mt-1">Click sections to edit</p>
            </div>

            {/* Sections List with Forms */}
            <div className="flex-1">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const FormComponent = section.component;
                    const isExpanded = expandedSection === section.id;

                    return (
                        <div key={section.id} className="border-b border-gray-200">
                            {/* Section Header - Clickable */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`
                  w-full flex items-center justify-between p-4 
                  transition-all duration-200 hover:bg-gray-50
                  ${isExpanded ? 'bg-purple-50 border-l-4 border-purple-500' : ''}
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        size={20}
                                        className={isExpanded ? 'text-purple-600' : 'text-gray-600'}
                                    />
                                    <span className={`text-sm font-medium ${isExpanded ? 'text-purple-700' : 'text-gray-700'}`}>
                                        {section.label}
                                    </span>
                                </div>
                                {isExpanded ? (
                                    <ChevronDown size={18} className='text-purple-600' />
                                ) : (
                                    <ChevronRight size={18} className='text-gray-500' />
                                )}
                            </button>

                            {/* Section Content - Form */}
                            {isExpanded && (
                                <div className="p-4 bg-gray-50 animate-fadeIn">
                                    <FormComponent
                                        enableNext={(v) => setEnableNext(v)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResumeSidebarWithForms;
