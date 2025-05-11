import React from 'react'
import { projectInfo, contributors } from './data';
import Header from './pageComponents/Header';
function AboutPage() {
  return (
        <>
      <Header />
         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
           <h1>{projectInfo.title}</h1>
           <p>{projectInfo.description}</p>
   
           <h2>Contributors</h2>
           <ul>
             {contributors.map((person, index) => (
                 <li key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                   <strong>Name:</strong> {person.name}<br />
                   <strong>ID:</strong> {person.id}<br />
                   <strong>Role:</strong> {person.role}<br />
                   <strong>Campus:</strong> {person.campus}
                 </li>
             ))}
           </ul>
         </div>
         </>
  )
}

export default AboutPage