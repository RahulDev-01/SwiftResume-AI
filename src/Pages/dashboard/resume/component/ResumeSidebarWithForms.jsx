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
        <div className="w-full h-full bg-white flex flex-col overflow-y-auto">
            {/* Sidebar Header */}
            <div className="px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">Resume Builder</h2>
                <p className="text-sm text-gray-500 mt-1">Click sections to edit</p>
            </div>

            {/* Sections List with Forms */}
            <div className="flex-1 py-2">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const FormComponent = section.component;
                    const isExpanded = expandedSection === section.id;

                    return (
                        <div key={section.id} className="border-b border-gray-100 last:border-b-0">
                            {/* Section Header - Clickable */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`
                  w-full flex items-center justify-between px-6 py-4
                  transition-all duration-300 ease-in-out hover:bg-gray-50
                  ${isExpanded ? 'bg-purple-50 border-l-4 border-l-purple-500' : 'border-l-4 border-l-transparent'}
                `}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon
                                        size={22}
                                        className={`transition-colors duration-300 ${isExpanded ? 'text-purple-600' : 'text-gray-600'}`}
                                    />
                                    <span className={`text-base font-semibold transition-colors duration-300 ${isExpanded ? 'text-purple-700' : 'text-gray-700'}`}>
                                        {section.label}
                                    </span>
                                </div>
                                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-0' : ''}`}>
                                    {isExpanded ? (
                                        <ChevronDown size={20} className='text-purple-600' />
                                    ) : (
                                        <ChevronRight size={20} className='text-gray-500' />
                                    )}
                                </div>
                            </button>

                            {/* Section Content - Form with smooth height transition */}
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 py-6 bg-gradient-to-b from-purple-50/50 to-white">
                                    <FormComponent
                                        enableNext={(v) => setEnableNext(v)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResumeSidebarWithForms;
