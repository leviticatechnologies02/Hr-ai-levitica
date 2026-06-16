import React from 'react';
import Modal from '../../../shared/components/Modal';

const VenueBookingModal = ({
  showVenueBookingModal,
  setShowVenueBookingModal,
  venueForm,
  setVenueForm,
  inductionPrograms,
  handleBookVenue
}) => {
  return (
    <Modal
      isOpen={showVenueBookingModal}
      onClose={() => setShowVenueBookingModal(false)}
      title="Book Venue"
      size="lg"
    >
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Select Program <span className="text-rose-500">*</span></label>
          <select 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
            value={venueForm.programId || ''}
            onChange={(e) => setVenueForm({
              ...venueForm, 
              programId: parseInt(e.target.value)
            })}
          >
            <option value="">Choose program...</option>
            {inductionPrograms.map(program => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Venue Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={venueForm.venueName}
              onChange={(e) => setVenueForm({...venueForm, venueName: e.target.value})}
              placeholder="e.g., Main Auditorium"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Capacity</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={venueForm.capacity}
              onChange={(e) => setVenueForm({...venueForm, capacity: e.target.value})}
              placeholder="Number of seats"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
          <textarea
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            rows="2"
            value={venueForm.address}
            onChange={(e) => setVenueForm({...venueForm, address: e.target.value})}
            placeholder="Venue address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Booking Date *</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={venueForm.bookingDate}
              onChange={(e) => setVenueForm({...venueForm, bookingDate: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time</label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={venueForm.startTime}
              onChange={(e) => setVenueForm({...venueForm, startTime: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Time</label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={venueForm.endTime}
              onChange={(e) => setVenueForm({...venueForm, endTime: e.target.value})}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowVenueBookingModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={handleBookVenue}
            disabled={!venueForm.programId || !venueForm.venueName || !venueForm.bookingDate}
          >
            Book Venue
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VenueBookingModal;
