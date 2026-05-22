import React from 'react';
import AutoServiceFinder from "./AutoServiceFinder.tsx";
import HowItWorks from "./HowItWorks.tsx";

const HeroSection: React.FC = () => {
    return (
        <section className="w-screen text-white pt-30 py-10 relative">
            <div
                className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                style={{
                    backgroundImage: "url('/hero_section.jpg')",
                }}
            />

            <div className="absolute inset-0 bg-slate-900/75"></div>

            <div className="relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start max-w-7xl mx-auto px-6">
                    <div className="w-full">
                        <AutoServiceFinder />
                    </div>

                    <div className="w-full flex justify-center lg:justify-start">
                        <HowItWorks />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;