import React from 'react'
import Updates from './Updates'
import './showcase.css'

function Showcase() {
    return(
        <div className="showcase">
            <h1>Our Services</h1>
            <div className="services-container">
                <div className="service-item">
                    <img className="icon" src="src\assets\futbol-regular.svg" alt="Soccer" />
                    <h4>Soccer Fields</h4>
                    <p className='service-description'>
                        We have 2 soccer fields available for rent. Each field is 100 yards long and 50
                    </p>
                </div>
                <div className="service-item">
                    <img className="icon" src="src\assets\basketball-solid.svg" alt="Basketball" />
                    <h4>Basketball Courts</h4>
                    <p className='service-description'>
                        We have 2 basketball courts available for rent. Each court is 94 feet long and
                    </p>
                </div>
                <div className="service-item">
                    <img className="icon" src="src\assets\person-swimming-solid.svg" alt="Swimming" />
                    <h4>Swimming Pools</h4>
                    <p className='service-description'>
                        We have 2 swimming pools available for rent. Each pool is 25 yards long and
                    </p>
                </div>
                <div className="service-item">
                    <img className="icon" src="src\assets\dumbbell-solid.svg" alt="Gym" />
                    <h4>Gym</h4>
                    <p className='service-description'>
                        We have a fully equipped gym available for rent. Our gym has a variety of equipment
                    </p>
                </div>
                <div className="service-item">
                    <img className="icon" src="src\assets\table-tennis-paddle-ball-solid.svg" alt="Swimming" />
                    <h4>Table Tennis</h4>
                    <p className='service-description'>
                        We have 2 table tennis tables available for rent. Each table is 9 feet long and
                    </p>
                </div>
            </div>
            <Updates/>
        </div>
    )
}

export default Showcase