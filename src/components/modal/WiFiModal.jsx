import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../login/LoginAssets/smarthardhatAsset 1.svg';

function WiFiModal({ onClose, onSave }) {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!ssid.trim() || !password.trim()) {
      toast.error('Please fill in both SSID and Password.', { position: 'top-right' });
      return;
    }

    setIsSaving(true);
    try {
      // Call the provided onSave callback or implement your save logic here
      if (onSave) await onSave({ ssid, password });
      toast.success('Wi-Fi credentials saved!', { position: 'top-right' });
      setSsid('');
      setPassword('');
      if (onClose) onClose();
    } catch (err) {
      toast.error('Saving failed. ' + err.message, { position: 'top-right' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md">
        <div className="p-8 relative">
          {/* Logo */}
          <div className="absolute top-4 left-4 flex items-center">
            <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
            <p className="font-semibold text-lg">
              <span className="text-bfpOrange font-bold">BFP</span>
              <span className="text-bfpNavy">SmartTrack</span>
            </p>
          </div>

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray hover:text-gray">
            ✕
          </button>

          {/* Form Header */}
          <div className="mt-12">
            <h2 className="text-2xl text-center text-bfpNavy font-bold mb-4">
              Add Wi-Fi Network
            </h2>
            <p className="text-center text-sm text-bfpNavy mb-6">
              Enter SSID and Password.
            </p>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label htmlFor="ssid" className="block text-sm font-medium text-gray-700">
                  SSID
                </label>
                <input
                  type="text"
                  id="ssid"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter network SSID"
                />
              </div>

              <div>
                <label htmlFor="wifi-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="wifi-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter network password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue text-white font-semibold rounded-md hover:bg-hoverBtn transition duration-300"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WiFiModal;
