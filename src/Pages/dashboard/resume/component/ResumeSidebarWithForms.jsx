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
    const [expandedSections, setExpandedSections] = useState([]);
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
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    return (
        <div
            className="w-full h-full bg-gray-50 flex flex-col overflow-x-hidden overflow-y-auto"
            style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none'  /* IE and Edge */
            }}
        >
            {/* Hide scrollbar for Chrome, Safari and Opera */}
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Centered Container */}
            <div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-8">
                {/* Professional Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Resume Builder</h2>
                    <p className="text-sm text-gray-600 mt-1">Complete each section to build your professional resume</p>
                </div>

                {/* Sections List */}
                <div className="space-y-3">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const FormComponent = section.component;
                        const isExpanded = expandedSections.includes(section.id);

                        return (
                            <div
                                key={section.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                            >
                                {/* Section Header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={`
                                        w-full flex items-center justify-between p-5
                                        transition-colors duration-200
                                        ${isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className={`
                                            p-2.5 rounded-lg transition-colors duration-200
                                            ${isExpanded
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                            }
                                        `}>
                                            <Icon size={20} />
                                        </div>

                                        {/* Label */}
                                        <span className={`
                                            text-base font-semibold transition-colors duration-200
                                            ${isExpanded ? 'text-blue-600' : 'text-gray-900'}
                                        `}>
                                            {section.label}
                                        </span>
                                    </div>

                                    {/* Chevron */}
                                    <div className={`
                                        transition-transform duration-200
                                        ${isExpanded ? 'rotate-180' : 'rotate-0'}
                                    `}>
                                        <ChevronDown
                                            size={20}
                                            className={isExpanded ? 'text-blue-600' : 'text-gray-400'}
                                        />
                                    </div>
                                </button>

                                {/* Section Content */}
                                <div
                                    className={`
                                        transition-all duration-300 ease-in-out
                                        ${isExpanded ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'}
                                    `}
                                >
                                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                                        <FormComponent
                                            enableNext={(v) => setEnableNext(v)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom spacing */}
                <div className="h-8"></div>
            </div>
        </div>
    );
};

export default ResumeSidebarWithForms;
