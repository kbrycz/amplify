import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Plus, Trash2, Shield, Eye, Edit2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ROLE_ICONS = {
  admin: <Shield className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />,
  'read/write': <Edit2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  'read-only': <Eye className="h-4 w-4 text-primary-600 dark:text-primary-400" />
};

const ROLE_LABELS = {
  admin: 'Admin',
  'read/write': 'Read/Write',
  'read-only': 'Read Only'
};

export default function NamespaceMembers({ members, setMembers, currentUser }) {
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('read/write');
  const [error, setError] = useState('');

  // Add the current user as admin if members is empty
  React.useEffect(() => {
    if (members.length === 0 && currentUser?.email) {
      setMembers([
        {
          email: currentUser.email,
          role: 'admin',
          name: currentUser.displayName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim(),
          isCurrentUser: true
        }
      ]);
    }
  }, [currentUser, members.length, setMembers]);

  const handleAddMember = () => {
    // Basic email validation
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if email already exists
    if (members.some(member => member.email.toLowerCase() === newEmail.toLowerCase())) {
      setError('This email is already added');
      return;
    }

    setMembers([
      ...members,
      {
        email: newEmail,
        role: newRole,
        name: '',
        isCurrentUser: false
      }
    ]);
    setNewEmail('');
    setError('');
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter(member => member.email !== email));
  };

  const handleRoleChange = (email, newRole) => {
    setMembers(members.map(member => 
      member.email === email ? { ...member, role: newRole } : member
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Members & Permissions
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add members to your namespace and set their permissions.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-3">
          <div>
            <Label htmlFor="email" className="sr-only">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full"
            />
          </div>
          <div>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read-only">Read Only</SelectItem>
                <SelectItem value="read/write">Read/Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddMember}
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Email
            </button>
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Members</h4>
          <div className="rounded-md border border-gray-200 dark:border-gray-700 relative">
            {members.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No members added yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member, index) => (
                  <li 
                    key={member.email} 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white dark:bg-gray-800 relative"
                    style={{ zIndex: members.length - index }}
                  >
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-800 dark:text-primary-300">
                          {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.email}
                          {member.isCurrentUser && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        {member.name && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {member.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end sm:space-x-3">
                      <div className="flex items-center space-x-1">
                        {ROLE_ICONS[member.role]}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {ROLE_LABELS[member.role]}
                        </span>
                      </div>
                      
                      {!member.isCurrentUser && (
                        <div className="flex items-center space-x-2 ml-auto sm:ml-0">
                          <div className="relative" style={{ zIndex: 100 }}>
                            <Select 
                              value={member.role} 
                              onValueChange={(value) => handleRoleChange(member.email, value)}
                              disabled={member.isCurrentUser}
                            >
                              <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue placeholder="Change role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="read-only">Read Only</SelectItem>
                                <SelectItem value="read/write">Read/Write</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.email)}
                            className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-1 mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You will always have admin access to namespaces you create and can add, delete, or modify users later on the Manage Namespaces page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 