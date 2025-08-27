import React from 'react';

function InitializationStatus({ isInitializing, initializationError, onRetry }) {
  if (!isInitializing && !initializationError) {
    return null; // Don't show anything if initialization is complete and successful
  }

  return (
    <div className="initialization-status">
      {isInitializing && (
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>
            <strong>Initializing therapy data...</strong>
            <br />
            <small>Setting up your ABA therapy modules and progress tracking.</small>
          </div>
        </div>
      )}

      {initializationError && (
        <div className="alert alert-warning" role="alert">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="alert-heading">⚠️ Data Initialization Issue</h6>
              <p className="mb-2">
                There was an issue setting up your therapy data. This is likely due to Firestore permissions.
              </p>
              <small className="text-muted">
                The app will work with limited functionality. Some features may not be available until this is resolved.
              </small>
            </div>
            {onRetry && (
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={onRetry}
              >
                Retry
              </button>
            )}
          </div>
          
          <hr />
          
          <div className="small">
            <strong>To fix this issue:</strong>
            <ol className="mb-0 mt-2">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Select your project: <code>cognibridge-demo</code></li>
              <li>Navigate to: <strong>Firestore Database</strong> → <strong>Rules</strong></li>
              <li>Update the security rules to allow authenticated users</li>
              <li>See <code>FIRESTORE_SETUP.md</code> for detailed instructions</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default InitializationStatus;
