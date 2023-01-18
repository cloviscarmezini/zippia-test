import { JobCard } from '@/components/JobCard';
import { JobDTO } from '@/dtos/JobsDTO';
import { api } from '@/services/api';
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head';
import { useKeenSlider } from 'keen-slider/react'

import 'keen-slider/keen-slider.min.css'
import { useMobile } from '@/hooks/useMobile';
import { useCallback, useEffect, useState } from 'react';
import { useFirstRender } from '@/hooks/useFirstRender';
import { Spinner } from '@/components/Spinner';


interface JobsProps {
    jobs: JobDTO[]
}

type JobsFiltersProps = {
    postingDateRange?: string
}

const Jobs: NextPage<JobsProps> = ({ jobs: initialJobs = [] }) => {
    const [jobs, setJobs] = useState<JobDTO[]>(initialJobs);
    const [jobsFilters, setJobsFilters] = useState<JobsFiltersProps>({});
    const [isLoading, setIsLoading] = useState(false);
    const { isMobile } = useMobile();
    const [sliderRef] = useKeenSlider({
        slides: {
          perView: 1,
          spacing: 48
        }
    });

    const isFirstRender = useFirstRender();

    function handleToggleFilterByLastSevenDays() {
        setJobsFilters(jobsFilters=> {
            return {
                ...jobsFilters,
                postingDateRange: jobsFilters.postingDateRange ? "" : "7d",
            }
        })
    }

    const fetchJobs = useCallback(async () => { // useCallback to prevent multiple re-rendering and request looping for api
        setIsLoading(true)
        try {
            const response = await api.post<{ jobs: JobDTO[] }>('/jobs', {
                companySkills: true,
                dismissedListingHashes: [],
                fetchJobDesc: true,
                jobTitle: 'Business Analyst',
                locations: [],
                numJobs: 10,
                previousListingHashes: [],
                ...jobsFilters
            })
    
            const newJobsList = response.data.jobs.map(job=>({
                ...job,
                shortDescription: job.jobDescription.slice(0, 300)
            }))
    
            setJobs(newJobsList)
        } catch(error) {
            alert('Something went wrong!')
        } finally {
            setIsLoading(false);
        }
    }, [jobsFilters])

    useEffect(() => {
        if(isFirstRender) return // prevent a api request from client-side when is rendering the component first time, because this the initial data comes from server-side.
        fetchJobs();
    }, [jobsFilters, fetchJobs, isFirstRender])

    return (
        <div>
            <Head>
                <title>Zippia Test</title>
            </Head>
            <header className="w-full py-5 flex align-center justify-center bg-gray-700 border-b border-gray-600">
                <h1 className="text-3xl text-white">Jobs list</h1>
            </header>
            <div
                className="flex justify-center"
            >
                <button
                    disabled={isLoading}
                    className="flex items-center mt-4 bg-gray-700  text-white uppercase p-4 rounded font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                    onClick={handleToggleFilterByLastSevenDays}
                >
                    { isLoading && <Spinner /> }
                    Date posted: { jobsFilters.postingDateRange ? 'Past Week' : 'All'}
                </button>
            </div>
            <main className="container mx-auto px-4 mb-4">
                {/* Validation to show carousel in mobile and a list for desktops */}
                { isMobile ? (
                    <div className="keen-slider" ref={sliderRef}>
                        { jobs.map(job=> {
                            return (
                                <div className="keen-slider__slide" key={job.jobId}>
                                    <JobCard job={job} />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div>
                        { jobs.map(job=> <JobCard key={job.jobId} job={job} />)}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Jobs

export const getServerSideProps: GetServerSideProps = async () => {
    const response = await api.post<{ jobs: JobDTO[] }>('/jobs', {
        companySkills: true,
        dismissedListingHashes: [],
        fetchJobDesc: true,
        jobTitle: 'Business Analyst',
        locations: [],
        numJobs: 10,
        previousListingHashes: []
    })

    const jobs = response.data.jobs.map(job=>({
        ...job,
        shortDescription: job.jobDescription.slice(0, 300)
    }))

    return {
        props: {
            jobs
        }
    }
}