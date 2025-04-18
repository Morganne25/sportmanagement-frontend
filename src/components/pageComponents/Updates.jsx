import React from 'react';
import './updates.css';

function Updates() {
    return(
        <div className="updates">
            <h1>Updates</h1>
            <div className="notification-container">
                <div className="notification-item">
                    <h4>Events</h4>
                    <p className='notification-description'>
                        Show planned events updates
                    </p>
                </div>
                <div className="notification-item">
                    <h4>Planned Maintenance</h4>
                    <p className='notification-description'>
                        Show planned maintenance updates
                    </p>
                </div>
                <div className="notification-item">
                    <h4>Facility Availability</h4>
                    <p className='notification-description'>
                        <a href="">Check Availability</a>
                    </p>
                </div>
                
            </div>
        </div>
    );
}

export default Updates