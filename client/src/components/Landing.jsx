import React from 'react';

function Landing() {
  const cardStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left',
  };

  const headingStyle = {
    color: '#333',
    fontSize: '28px',
    marginBottom: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const subHeadingStyle = {
    color: '#555',
    fontSize: '24px',
    marginTop: '30px',
    fontWeight: 'bold',
  };

  const paragraphStyle = {
    color: '#666',
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '20px',
  };

  const emphasisStyle = {
    color: '#007bff',
    fontWeight: 'bold',
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Welcome to SchedEz</h2>
      <p style={paragraphStyle}>
        Revolutionizing scheduling for <span style={emphasisStyle}>effortless time management</span>. SchedEz provides a comprehensive solution to traditional scheduling complexities. Our user-friendly, web-based application empowers users to create, modify, and view schedules with unparalleled ease.
      </p>
      <h3 style={subHeadingStyle}>Effortless Organization</h3>
      <p style={paragraphStyle}>
        Managing events, classes, and activities becomes a breeze. Craft schedules based on specific days and time intervals. Embrace clarity through color-coding and classification for seamless differentiation between tasks.
      </p>
      <h3 style={subHeadingStyle}>Seamless Collaboration</h3>
      <p style={paragraphStyle}>
        Smooth cooperation with collaboration capabilities. Multiple users can access and contribute to the same schedule, fostering teamwork and synchronization.
      </p>
      <h3 style={subHeadingStyle}>Simplify, Manage, Excel</h3>
      <p style={paragraphStyle}>
        Simplify scheduling complexities, empower time management, and boost productivity. Say goodbye to limitations – SchedEz revolutionizes the way you organize your time.
      </p>
      <br/>
      <br/>
      <h3 style={subHeadingStyle}>Join the SchedEz Revolution Today!</h3>
      <p style={{ ...paragraphStyle, textAlign: 'center' }}>
        Embrace a new era of effortless scheduling and productivity.
      </p>
    </div>
  );
}

export default Landing;
