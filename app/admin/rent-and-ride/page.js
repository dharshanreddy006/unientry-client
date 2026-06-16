'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { API_URL, getImageUrl } from '@/lib/apiConfig';

export default function RentAndRideAdmin() {
  const [vehicles, setVehicles] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    vehicleName: '',
    vehicleType: 'Bike',
    universityId: '',
    price: '',
    availableHours: 0,
    status: 'Not Available',
    description: '',
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, uRes] = await Promise.all([
        fetch(`${API_URL}/rent-and-rides`, { cache: 'no-store' }),
        fetch(`${API_URL}/universities`, { cache: 'no-store' })
      ]);
      const vData = await vRes.json();
      const uData = await uRes.json();
      if (vData.success) setVehicles(vData.data);
      if (uData.success) setUniversities(uData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await fetch('https://unientry-server-production.up.railway.app/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('unientry_token')}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.data ? data.data.url : data.url }));
      } else {
        alert('Upload failed: ' + data.message);
        if (data.message && (data.message.includes('Token') || data.message.includes('authorized'))) {
          localStorage.removeItem('unientry_token');
          localStorage.removeItem('unientry_admin');
          window.location.href = '/admin/login';
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/rent-and-rides/${editingId}` : `${API_URL}/rent-and-rides`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('unientry_token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save vehicle');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      const res = await fetch(`${API_URL}/rent-and-rides/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('unientry_token')}` }
      });
      
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (vehicle = null) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData({
        vehicleName: vehicle.vehicleName || '',
        vehicleType: vehicle.vehicleType || 'Bike',
        universityId: vehicle.universityId || '',
        price: vehicle.price || '',
        availableHours: vehicle.availableHours || 0,
        status: vehicle.status || 'Not Available',
        description: vehicle.description || '',
        imageUrl: vehicle.imageUrl || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        vehicleName: '',
        vehicleType: 'Bike',
        universityId: universities.length > 0 ? universities[0].id : '',
        price: '',
        availableHours: 0,
        status: 'Not Available',
        description: '',
        imageUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  return (
    <AdminShell title="Rent & Ride Management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Campus Vehicles</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500">Vehicle</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500">University</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500">Price/Time</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No vehicles found. Add one to get started.</td>
                  </tr>
                ) : vehicles.map(vehicle => {
                  const uni = universities.find(u => u.id === vehicle.universityId);
                  return (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-xl">
                            {vehicle.imageUrl ? (
                              <img src={getImageUrl(vehicle.imageUrl)} alt={vehicle.vehicleName} className="w-full h-full object-cover" />
                            ) : (
                              vehicle.vehicleType === 'Bike' ? '🛵' : '🚘'
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{vehicle.vehicleName}</p>
                            <p className="text-xs text-gray-500">{vehicle.vehicleType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {uni ? uni.universityName : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>{vehicle.price}</p>
                        <p className="text-xs text-gray-400">for {vehicle.availableHours} hrs</p>
                      </td>
                      <td className="px-6 py-4">
                        {vehicle.isAvailable ? (
                           <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">Available</span>
                        ) : (
                           <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">Not Available</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal(vehicle)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleName}
                    onChange={e => setFormData({...formData, vehicleName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Honda Activa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="Bike">Bike</option>
                    <option value="Car">Car</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <select
                  value={formData.universityId}
                  onChange={e => setFormData({...formData, universityId: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select University</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.universityName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., ₹50/hour"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Hours</label>
                  <input
                    type="number"
                    value={formData.availableHours}
                    onChange={e => setFormData({...formData, availableHours: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., 24"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="Available">Available (Starts Now)</option>
                  <option value="Not Available">Not Available</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">If set to Available, the timer starts from now for the specified Available Hours.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="/uploads/..."
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-200 h-full flex items-center whitespace-nowrap">
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
