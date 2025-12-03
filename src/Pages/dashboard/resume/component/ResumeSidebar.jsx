import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    User,
    Briefcase,
    GraduationCap,
    Award,
    Lightbulb,
    Languages,
    FileText,
    Download
} from 'lucide-react';


const ResumeSidebar = ({ activeSection, onSectionChange, isTemplate2 }) => {
    const [expandedSections, setExpandedSections] = useState({
        'basic-details': true,
        'skills': false,
        'education': false,
        'experience': false,
        'responsibilities': false,
        'achievements': false,
        'certifications': false,
        'projects': false,
        'social-links': false
    });

    // Define sections based on template
    const sections = [
        { id: 1, key: 'basic-details', label: 'Basic Details', icon: User },
        { id: 2, key: 'summary', label: 'Summary', icon: FileText },
        { id: 3, key: 'experience', label: 'Experience', icon: Briefcase },
        { id: 4, key: 'education', label: 'Education', icon: GraduationCap },
        { id: 5, key: 'skills', label: 'Skills & Expertise', icon: Lightbulb },
    ];

    // Add template 2 specific sections
    if (isTemplate2) {
        sections.push(
            { id: 6, key: 'certifications', label: 'Certificates', icon: Award },
            { id: 7, key: 'languages', label: 'Languages', icon: Languages }
        );
    }

    const toggleSection = (key) => {
        setExpandedSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSectionClick = (sectionId, key) => {
        // Toggle expansion
        setExpandedSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        // Also change active section
        onSectionChange(sectionId);
    };

    return (
        <div className="w-full h-full bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Resume Sections</h2>
                <p className="text-xs text-gray-500 mt-1">Click to edit sections</p>
            </div>

            {/* Sections List */}
            <div className="flex-1 overflow-y-auto p-2">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const isExpanded = expandedSections[section.key];

                    return (
                        <div key={section.id} className="mb-1">
                            <button
                                onClick={() => handleSectionClick(section.id, section.key)}
                                className={`
                  w-full flex items-center justify-between p-3 rounded-lg
                  transition-all duration-200 group
                  ${isActive
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        size={18}
                                        className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}
                                    />
                                    <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                                        {section.label}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSection(section.key);
                                    }}
                                    className="p-1 hover:bg-white/20 rounded"
                                >
                                    {isExpanded ? (
                                        <ChevronDown size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                                    ) : (
                                        <ChevronRight size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                                    )}
                                </button>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResumeSidebar;
