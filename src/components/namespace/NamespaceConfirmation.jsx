import React from 'react';
import { Shield, Eye, Edit2 } from 'lucide-react';

const ROLE_ICONS = {
  admin: <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
  'read/write': <Edit2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  'read-only': <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
};

const ROLE_LABELS = {
  admin: 'Admin',
  'read/write': 'Read/Write',
  'read-only': 'Read Only'
};

export default function NamespaceConfirmation({ formData, members }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Confirm Namespace Details
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please review all information before creating your namespace.
        </p>
      </div>

      <div className="space-y-6">
        {/* Namespace Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Namespace Information</h4>
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-800">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Namespace Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formData.name || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Description</span>
                <span className="text-sm text-gray-900 dark:text-white">{formData.description || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Members */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Members & Permissions</h4>
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {members.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                No members added
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800">
                {/* Desktop view - Table */}
                <div className="hidden sm:block">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {members.map((member, index) => (
                        <tr key={member.email} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {member.email}
                            {member.isCurrentUser && (
                              <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center space-x-1">
                              {ROLE_ICONS[member.role]}
                              <span>{ROLE_LABELS[member.role]}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile view - Card list */}
                <div className="sm:hidden">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {members.map((member) => (
                      <li key={member.email} className="p-4">
                        <div className="mb-1">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.email}
                            </span>
                            {member.isCurrentUser && (
                              <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Role:</span>
                          <div className="flex items-center space-x-1">
                            {ROLE_ICONS[member.role]}
                            <span className="text-sm text-gray-900 dark:text-white">{ROLE_LABELS[member.role]}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 