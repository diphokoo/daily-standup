import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import sprintData from '../data/sprintData.json';

function Settings() {
  const [settings, setSettings] = useState({
    fullName: "",
    email: "",
    notifications: true,
    marketingEmails: false,
    theme: "light",
    twoFactorAuth: false,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSettings((prev) => ({
          ...prev,
          fullName: user.displayName || "",
          email: user.email || "",
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved settings:", settings);
  };

  return (
    <div className="container py-4">
      <h3 className="h3 mb-4">Settings - {sprintData.projectName}</h3>

      <div className="card shadow border-0">
        <div className="card-body">

        <form onSubmit={handleSubmit}>
          
          {/* Profile Section */}
          <div className="mb-4">
            <h2 className="h5 mb-3">Profile</h2>
            <div>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={settings.fullName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <hr />
          {/* Notifications */}
          <div className="mb-4">
            <h2 className="h5 mb-3">Notifications</h2>
            <div>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <label htmlFor="notifications">Enable push notifications</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    role="switch"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="form-check-input"
                    id="notifications"
                    style={{ width: '3rem', height: '1.5rem' }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="marketingEmails">Receive marketing emails</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    role="switch"
                    name="marketingEmails"
                    checked={settings.marketingEmails}
                    onChange={handleChange}
                    className="form-check-input"
                    id="marketingEmails"
                    style={{ width: '3rem', height: '1.5rem' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* Appearance */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="mb-4 col-6 col-md-6">
              <h2 className="h5 mb-3">Appearance</h2>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="form-select w-50"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>

            {/* Security */}
            <div className="mb-4 col-6 col-md-6">
              <h2 className="h5 mb-3">Security</h2>
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    role="switch"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleChange}
                    className="form-check-input"
                    id="twoFactorAuth"
                    style={{ width: '3rem', height: '1.5rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}


export default Settings;