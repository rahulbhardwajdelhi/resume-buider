import React, { useEffect, useRef, useState } from 'react';
import {
    LuMapPinHouse,
    LuPhone,
    LuMail,
    LuRss,
    LuUser,
} from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import ContactInfo from '../ResumeSections/ContactInfo';
import EducationInfo from '../ResumeSections/EducationInfo';
import { formatYearMonth } from '../../utils/helper';
import LanguageSection from '../ResumeSections/LanguageSection';
import WorkExperience from '../ResumeSections/WorkExperience';
import ProjectInfo from '../ResumeSections/ProjectInfo';
import SkillSection from '../ResumeSections/SkillSection';
import CertificationInfo from '../ResumeSections/CertificationInfo';

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"];

const Title = ({ text, color }) => {
    return (
        <div className='relative w-fit mb-1.5'>
            <span
                className='absolute bottom-0 left-0 w-full h-1.5'
                style={{ backgroundColor: color }}
            ></span>
            <h2 className={`relative text-sm font-bold`}>{text}</h2>
        </div>
    );
};

const TemplateTwo = ({ resumeData, colorPalette, containerWidth }) => {
    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

    const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(800);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const actualBaseWidth = resumeRef.current?.offsetWidth || 800;
        setBaseWidth(actualBaseWidth);
        setScale(containerWidth / actualBaseWidth);
    }, [containerWidth]);

    return (
        <div
            ref={resumeRef}
            className="p-3 bg-white"
            style={{
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            {/* Header / Profile Section */}
            <div className="px-10 pt-6 pb-3">
                <div className="flex items-start gap-4 mb-3">
                    <div
                        className="w-[140px] h-[140px] max-w-[140px] max-h-[140px] rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: themeColors[1] }}
                    >
                        {resumeData.profileInfo.profilePreviewUrl ? (
                            <img
                                src={resumeData.profileInfo.profilePreviewUrl}
                                className="w-[140px] h-[140px] rounded-2xl"
                            />
                        ) : (
                            <div
                                className="w-[140px] h-[140px] flex items-center justify-center text-5xl rounded-full"
                                style={{ color: themeColors[4] }}
                            >
                                <LuUser />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-12 gap-1">
                        <div className="col-span-6">
                            <h2 className="text-2xl font-bold">{resumeData.profileInfo.fullName}</h2>
                            <p className="text-[15px] font-semibold mb-1">{resumeData.profileInfo.designation}</p>

                            <ContactInfo
                                icon={<LuMapPinHouse />}
                                iconBG={themeColors[2]}
                                value={resumeData.contactInfo.location}
                            />
                        </div>

                        <div className="col-span-6 flex flex-col gap-2 mt-1">
                            <ContactInfo
                                icon={<LuMail />}
                                iconBG={themeColors[2]}
                                value={resumeData.contactInfo.email}
                            />

                            <ContactInfo
                                icon={<LuPhone />}
                                iconBG={themeColors[2]}
                                value={resumeData.contactInfo.phone}
                            />
                        </div>

                        <div className="col-span-6">
                            {resumeData.contactInfo.linkedin && (
                                <ContactInfo
                                    icon={<RiLinkedinLine />}
                                    iconBG={themeColors[2]}
                                    value={resumeData.contactInfo.linkedin}
                                />
                            )}
                        </div>

                        <div className="col-span-6">
                            <ContactInfo
                                icon={<LuRss />}
                                iconBG={themeColors[2]}
                                value={resumeData.contactInfo.website}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-10 pb-3">

                {/* Professional Summary */}
                <div className="mb-3">
                    <Title text="Professional Summary" color={themeColors[1]} />
                    <p className="text-sm font-medium">{resumeData.profileInfo.summary}</p>
                </div>

                {/* Work Experience */}
                <div className="mb-3">
                    <Title text="Work Experience" color={themeColors[1]} />
                    {resumeData.workExperience.map((data, index) => (
                        <WorkExperience
                            key={`work_${index}`}
                            company={data.company}
                            role={data.role}
                            duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                            durationColor={themeColors[4]}
                            description={data.description}
                        />
                    ))}
                </div>

                {/* Projects */}
                <div className="mb-3">
                    <Title text="Projects" color={themeColors[1]} />
                    {resumeData.projects.map((project, index) => (
                        <ProjectInfo
                            key={`project_${index}`}
                            title={project.title}
                            description={project.description}
                            githubLink={project.github}
                            liveDemoUrl={project.liveDemo}
                            bgColor={themeColors[2]}
                        />
                    ))}
                </div>

                {/* Education */}
                <div className="mb-3">
                    <Title text="Education" color={themeColors[1]} />
                    <div className='grid grid-cols-2 gap-2'>
                        {resumeData.education.map((data, index) => (
                            <EducationInfo
                                key={`education_${index}`}
                                degree={data.degree}
                                institution={data.institution}
                                duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                <div className="mb-3">
                    <Title text="Certifications" color={themeColors[1]} />
                    <div className='grid grid-cols-2 gap-3'>
                        {resumeData.certifications.map((data, index) => (
                            <CertificationInfo
                                key={`cert_${index}`}
                                title={data.title}
                                issuer={data.issuer}
                                year={data.year}
                                bgColor={themeColors[2]}
                            />
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div className="mb-3">
                    <Title text="Skills" color={themeColors[1]} />
                    <SkillSection
                        skills={resumeData.skills}
                        accentColor={themeColors[3]}
                        bgColor={themeColors[2]}
                    />
                </div>

                {/* Languages & Interests */}
                <div className="grid grid-cols-2 gap-6 mb-3">
                    <div>
                        <Title text="Languages" color={themeColors[1]} />
                        <LanguageSection
                            languages={resumeData.languages}
                            themeColors={themeColors[3]}
                            bgColor={themeColors[2]}
                        />
                    </div>

                    {resumeData.interests.length > 0 && resumeData.interests[0] !== "" && (
                        <div>
                            <Title text="Interests" color={themeColors[1]} />
                            <div className="flex items-center flex-wrap gap-2 mt-2">
                                {resumeData.interests.map((interest, index) => (
                                    <div
                                        key={`interest_${index}`}
                                        className="text-[10px] font-medium py-1 px-2 rounded-lg"
                                        style={{ backgroundColor: themeColors[2] }}
                                    >
                                        {interest}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TemplateTwo;
