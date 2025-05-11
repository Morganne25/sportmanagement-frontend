// src/components/Showcase.jsx
import React from 'react';
import Updates from './Updates';
import './showcase.css';
import { useNavigate } from 'react-router-dom';

// Import icons as modules so they work globally
import soccerIcon from '../../assets/futbol-regular.svg';
import basketballIcon from '../../assets/basketball-solid.svg';
import swimmingIcon from '../../assets/person-swimming-solid.svg';
import gymIcon from '../../assets/dumbbell-solid.svg';
import tableTennisIcon from '../../assets/table-tennis-paddle-ball-solid.svg';

const facilities = [
  {
    key: 'soccer',
    name: 'Soccer Fields',
    description: 'We have 2 soccer fields available for rent. Each field is 100 yards long and 50 yards wide.',
    icon: soccerIcon,
  },
  {
    key: 'basketball',
    name: 'Basketball Courts',
    description: 'We have 2 basketball courts available for rent. Each court is 94 feet long.',
    icon: basketballIcon,
  },
  {
    key: 'swimming',
    name: 'Swimming Pools',
    description: 'We have 2 swimming pools available for rent. Each pool is 25 yards long.',
    icon: swimmingIcon,
  },
  {
    key: 'gym',
    name: 'Gym',
    description: 'We have a fully equipped gym available for rent. Our gym has a variety of equipment.',
    icon: gymIcon,
  },
  {
    key: 'table-tennis',
    name: 'Table Tennis',
    description: 'We have 2 table tennis tables available for rent. Each table is 9 feet long.',
    icon: tableTennisIcon,
  }
];

function Showcase() {
  const navigate = useNavigate();

  const handleClick = (facilityKey) => {
    navigate(`/booking/${facilityKey}`);
  };

  return (
    <div className="showcase">
      <h1>Our Services</h1>
      <div className="services-container">
        {facilities.map((facility) => (
          <div
            key={facility.key}
            className="service-item"
            onClick={() => handleClick(facility.key)}
            style={{ cursor: 'pointer' }}
          >
            <img className="icon" src={facility.icon} alt={facility.name} />
            <h4>{facility.name}</h4>
            <p className="service-description">{facility.description}</p>
          </div>
        ))}
      </div>
      <Updates />
    </div>
  );
}

export default Showcase;
