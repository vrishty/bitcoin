import React from 'react';

function Dashboard({ price }) {
    /* if (price === "0.00") {
        return <h2>Please select a currency</h2>;
    } */
    return (
        <div className="dashboard">
            <h2>{`$${price}`}</h2>
        </div>
    );
}

export default Dashboard;