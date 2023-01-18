import { useRef, useState } from "react";
import Image from "next/image";
import { JobDTO } from "@/dtos/JobsDTO";
import xss from "xss";

interface JobCardProps {
    job: JobDTO
}

export function JobCard({ job }: JobCardProps) {
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const jobDescription = isContentExpanded ? job.jobDescription : job.shortDescription;

    function handleToggleDescriptionView() {
        setIsContentExpanded(isContentExpanded=> !isContentExpanded);
        if(isContentExpanded && cardRef.current) {
            cardRef.current.scrollIntoView({block: "start", behavior: "smooth"});
        }
    }

    return (
        <div
            className="rounded-md shadow-md border border-zinc-100 p-4 mt-4 hover:border-zinc-300 group"
            ref={cardRef}
        >
            <div className="flex gap-5">
                <Image
                    src={job.companyLogo ?? '/defaultCompany.jpg'}
                    height={50}
                    width={50}
                    className="object-contain"
                    alt="company logo"
                />
                <div className="flex-1">
                    <header>
                        <div className="flex justify-between">
                            <h2
                                className="flex-1 text-lg font-bold flex items-center gap-2 text-zync-900 group-hover:text-blue-500"
                            >
                                {job.jobTitle}
                            </h2>
                            <span className="text-sm">{job.postedDate}</span>
                        </div>
                        <p
                            className="block text-zync-800"
                        >
                            {job.companyName}
                        </p>
                    </header>
                    <div
                        className="text-zync-400 mt-6"
                        dangerouslySetInnerHTML={{
                            __html: xss(jobDescription) //Sanitize untrusted HTML
                        }}
                    />

                    <button onClick={handleToggleDescriptionView} className="mt-2 text-blue-500">
                        {isContentExpanded ? 'See less' : 'See more' }
                    </button>
                </div>
            </div>

        </div>
    )
}