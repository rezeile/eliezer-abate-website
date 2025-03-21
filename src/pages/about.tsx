// src/pages/about.tsx
import React from 'react';
import Image from 'next/image';
import Layout from '../components/Layout';

const About: React.FC = () => {
  return (
    <Layout title="About | Eliezer Abate" description="About Eliezer Abate">
      <div className="py-12">
        <h1 className="text-3xl font-serif mb-8">About Me</h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
            <Image 
              src="/images/profile.jpg" 
              alt="Eliezer Abate" 
              width={128} 
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="prose">
            <p>
              I&apos;m Eliezer Abate, a software engineer with a passion for elegant solutions to complex problems.
              Currently, I work at [Company Name] where I focus on building scalable web applications.
            </p>
            
            <p>
              Previously, I taught computer science courses at [University/School Name] and worked at [Previous Company].
              I hold a degree in Computer Science from [University Name].
            </p>
            
            <p>
              When I&apos;m not coding, you can find me reading about algorithms, contributing to open-source projects,
              or writing tutorials on my blog.
            </p>
            
            <h2>Connect</h2>
            <ul>
              <li><a href="https://github.com/eliezerabate" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://twitter.com/eliezerabate" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://linkedin.com/in/eliezerabate" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;