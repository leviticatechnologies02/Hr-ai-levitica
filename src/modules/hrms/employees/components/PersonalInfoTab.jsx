import React from 'react';
import { Icon } from '@iconify/react';

const PersonalInfoTab = ({ employee, formatDate }) => {
  const personalInfo = employee.personalInfo || {};
  const identification = personalInfo.identification || {};

  // Helper function to format date safely
  const safeFormatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatDate(dateString);
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="col-span-1 md:col-span-2">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:identification" />
            </span>
            <span>Basic Information</span>
          </h6>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Full Name</label>
          <p className="text-gray-900">{employee.name || 'N/A'}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Date of Birth</label>
          <p className="text-gray-900">{safeFormatDate(personalInfo.dateOfBirth)}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Gender</label>
          <p className="text-gray-900">{personalInfo.gender || 'N/A'}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Blood Group</label>
          <p className="text-gray-900">{personalInfo.bloodGroup || 'N/A'}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Marital Status</label>
          <p className="text-gray-900">{personalInfo.maritalStatus || 'N/A'}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Nationality</label>
          <p className="text-gray-900">{personalInfo.nationality || 'N/A'}</p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Languages</label>
          <p className="text-gray-900">
            {personalInfo.languages && personalInfo.languages.length > 0
              ? personalInfo.languages.join(', ')
              : 'N/A'}
          </p>
        </div>

        {/* Contact Information */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:phone" />
            </span>
            <span>Contact Information</span>
          </h6>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Personal Email</label>
          <p className="text-gray-900">{personalInfo.personalEmail || 'N/A'}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Primary Phone</label>
          <p className="text-gray-900">{personalInfo.phonePrimary || 'N/A'}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Secondary Phone</label>
          <p className="text-gray-900">{personalInfo.phoneSecondary || 'N/A'}</p>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Emergency Phone</label>
          <p className="text-gray-900">{personalInfo.phoneEmergency || 'N/A'}</p>
        </div>

        {/* Address Information */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:map-pin" />
            </span>
            <span>Address Information</span>
          </h6>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Current Address</label>
          <div className="text-gray-900">
            {personalInfo.currentAddress ? (
              <div>
                <div>{personalInfo.currentAddress.line1 || ''}</div>
                {personalInfo.currentAddress.line2 && <div>{personalInfo.currentAddress.line2}</div>}
                <div>
                  {[personalInfo.currentAddress.city, personalInfo.currentAddress.state, personalInfo.currentAddress.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div>{personalInfo.currentAddress.country || ''}</div>
              </div>
            ) : 'N/A'}
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Permanent Address</label>
          <div className="text-gray-900">
            {personalInfo.permanentAddress ? (
              <div>
                <div>{personalInfo.permanentAddress.line1 || ''}</div>
                {personalInfo.permanentAddress.line2 && <div>{personalInfo.permanentAddress.line2}</div>}
                <div>
                  {[personalInfo.permanentAddress.city, personalInfo.permanentAddress.state, personalInfo.permanentAddress.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div>{personalInfo.permanentAddress.country || ''}</div>
              </div>
            ) : 'N/A'}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:user-group" />
            </span>
            <span>Emergency Contacts</span>
          </h6>

          {personalInfo.emergencyContacts && personalInfo.emergencyContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                  <tr>
                    <th className="text-gray-500">Name</th>
                    <th className="text-gray-500">Relation</th>
                    <th className="text-gray-500">Phone</th>
                    <th className="text-gray-500">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.emergencyContacts.map((contact, idx) => (
                    <tr key={idx}>
                      <td>{contact.name || 'N/A'}</td>
                      <td>{contact.relation || 'N/A'}</td>
                      <td>{contact.phone || 'N/A'}</td>
                      <td><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{contact.priority || 'Primary'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No emergency contacts added</p>
          )}
        </div>

        {/* Family Members */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:home" />
            </span>
            <span>Family Members</span>
          </h6>

          {personalInfo.familyMembers && personalInfo.familyMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                  <tr>
                    <th className="text-gray-500">Name</th>
                    <th className="text-gray-500">Relation</th>
                    <th className="text-gray-500">Date of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.familyMembers.map((member, idx) => {
                    // Handle both 'dob' and 'dateOfBirth' property names
                    const dob = member.dob || member.dateOfBirth || '';
                    return (
                      <tr key={idx}>
                        <td>{member.name || 'N/A'}</td>
                        <td>{member.relation || 'N/A'}</td>
                        <td>{dob ? safeFormatDate(dob) : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No family members added</p>
          )}
        </div>

        {/* Nominees */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:gift" />
            </span>
            <span>Nominee Information</span>
          </h6>

          {personalInfo.nominees && personalInfo.nominees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                  <tr>
                    <th className="text-gray-500">Name</th>
                    <th className="text-gray-500">Relation</th>
                    <th className="text-gray-500">Phone Number</th>
                    <th className="text-gray-500">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.nominees.map((nominee, idx) => {
                    // Handle different property names
                    const phoneNumber = nominee.phone || nominee.phoneNo || nominee.contactNo || 'N/A';
                    const percentage = nominee.percentage !== undefined ? nominee.percentage :
                      nominee.percentageShare !== undefined ? nominee.percentageShare : 'N/A';

                    return (
                      <tr key={idx}>
                        <td>{nominee.name || 'N/A'}</td>
                        <td>{nominee.relation || 'N/A'}</td>
                        <td>{phoneNumber}</td>
                        <td>{percentage !== 'N/A' ? `${percentage}%` : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No nominees added</p>
          )}
        </div>

        {/* Identification Documents */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:document-text" />
            </span>
            <span>Identification Documents</span>
          </h6>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">PAN Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 mb-0">{identification.pan?.number || 'N/A'}</p>
            {identification.pan?.verified && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Aadhaar Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 mb-0">{identification.aadhaar?.number || 'N/A'}</p>
            {identification.aadhaar?.verified && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Passport Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 mb-0">{identification.passport?.number || 'N/A'}</p>
            {identification.passport?.verified && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
            )}
          </div>
          {identification.passport?.expiryDate && (
            <text-sm className="text-gray-500">Expiry: {safeFormatDate(identification.passport.expiryDate)}</text-sm>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Voter ID Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 mb-0">{identification.voterId?.number || 'N/A'}</p>
            {identification.voterId?.verified && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
