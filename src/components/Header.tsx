import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-6 border-b border-gray-700">
            <div className="container mx-auto flex items-center justify-center space-x-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    AI Vehicle Recommender
                </h1>
            </div>
            <p className="text-center text-gray-400 mt-2 px-2">Experience the Future of Vehicle Selection Tailored by AI for Indian Roads</p>
        </header>
    );
};

export default Header;