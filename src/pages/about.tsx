// src/pages/about.tsx
import React from 'react';
import Layout from '../components/Layout';

const About: React.FC = () => {
  return (
    <Layout title="About | Eliezer Abate" description="About Eliezer Abate">
      <div className="py-20 max-w-xl mx-auto">

        {/* Photo */}
        <div className="mb-10">
          <img
            src="/headshot.jpg"
            alt="Eliezer Abate"
            className="w-32 h-32 rounded-full object-cover object-top grayscale"
          />
        </div>

        {/* Header */}
        <h1 className="text-4xl font-serif mb-2">Eliezer Abate</h1>
        <p className="text-gray-500 mb-8">Engineer & Political Economist</p>

        {/* Bio */}
        <div className="space-y-4 text-gray-700 leading-relaxed mb-12">
          <p>
            I research and visualize the political economy of the Horn of Africa—how states form, borders shift, and power flows.
          </p>
          <p>
            I'm the founder of <a href="https://graspwell.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition-colors">GraspWell</a>, where I build interactive maps and visual essays to bring clarity to a complex region.
          </p>
          <p>
            Before this, I worked as a software engineer building data infrastructure and web applications. I studied Computer Science and have spent years combining engineering with long-form research.
          </p>
        </div>

        {/* Focus */}
        <div className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Focus</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Political economy & state formation</li>
            <li>• Spatial history & borders</li>
            <li>• Data visualization & interactive media</li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Connect</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="https://twitter.com/eliezerabate" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">X ↗</a>
            <span className="text-gray-300">·</span>
            <a href="https://github.com/eliezerabate" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">GitHub ↗</a>
            <span className="text-gray-300">·</span>
            <a href="https://linkedin.com/in/eliezerabate" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">LinkedIn ↗</a>
            <span className="text-gray-300">·</span>
            <a href="mailto:eliezer@graspwell.com" className="hover:text-gray-900 transition-colors">Email ↗</a>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default About;
