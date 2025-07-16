// src/components/Showcase.jsx
import React from 'react';
import Updates from './Updates';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container my-5" style={{ backgroundColor: 'hsl(0, 13%, 9%)', color: 'white', textAlign: 'center', padding: '40px 20px', borderRadius: '12px' }}>
      <h1 className="mb-4" style={{ color: 'white' }}>Our Services</h1>
      <div className="row justify-content-center" style={{ gap: '24px', marginTop: '30px' }}>
        {facilities.map((facility) => (
          <div
            key={facility.key}
            className="col-md-4 mb-4"
            onClick={() => handleClick(facility.key)}
            style={{ cursor: 'pointer', minWidth: '260px' }}
          >
            <div className="card h-100" style={{ backgroundColor: 'hsl(0, 9%, 15%)', border: '1px solid hsl(31, 70%, 40%)', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 12%)';
                e.currentTarget.style.borderColor = 'hsl(0, 0%, 87%)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.backgroundColor = 'hsl(0, 9%, 15%)';
                e.currentTarget.style.borderColor = 'hsl(31, 70%, 40%)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
              }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <img
                  src={facility.icon}
                  alt={facility.name}
                  style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'invert(100%)', marginBottom: '12px' }}
                />
                <h5 className="card-title" style={{ fontSize: '1.6em', marginBottom: '10px', color: 'hsl(31, 70%, 50%)' }}>{facility.name}</h5>
                <p className="card-text" style={{ fontSize: '16px', color: 'hsl(31, 70%, 80%)' }}>{facility.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Updates />
    </div>
  );
}

export default Showcase;
