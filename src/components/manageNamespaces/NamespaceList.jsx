import React from 'react';
import { Plus, Users, Shield, Edit2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NamespaceRow from './NamespaceRow';

const ROLE_ICONS = {
  admin: <Shield className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />,
  'read/write': <Edit2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  readonly: <Eye className="h-4 w-4 text-primary-600 dark:text-primary-400" />
};

export default function NamespaceList({ namespaces, onDelete, onNamespaceClick, onNewNamespace, isEditMode = false }) {
  const { user } = useAuth();

  // Function to get the user's role in a namespace
  const getUserRole = (namespace) => {
    const userEmail = user?.email?.toLowerCase();
    if (!userEmail || !namespace.members) return 'readonly';
    
    // Find the user in the members array
    const member = namespace.members.find(m => m.email.toLowerCase() === userEmail);
    
    // Return the permission if found, otherwise default to readonly
    return member?.permission || 'readonly';
  };

  // Function to get the role icon
  const getRoleIcon = (role) => {
    return ROLE_ICONS[role] || ROLE_ICONS.readonly;
  };

  if (namespaces.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-white to-white opacity-50 dark:from-primary-900/20 dark:via-gray-900 dark:to-gray-900" />
        <div className="relative">
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900/50">
                <Users className="h-8 w-8 text-primary-text-600 dark:text-primary-text-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Create Your First Namespace
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              Start creating namespaces to organize your content and control access for different teams or projects.
            </p>
            <button
              onClick={onNewNamespace}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-primary-500 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Create Namespace
            </button>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
                  <Shield className="h-6 w-6 text-primary-text-600 dark:text-primary-text-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Role-Based Access</h3>
                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                  Assign different roles to team members
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Team Collaboration</h3>
                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                  Work together with your team members
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Content Organization</h3>
                <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
                  Organize content by project or team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {namespaces.map((namespace) => {
        const userRole = getUserRole(namespace);
        return (
          <NamespaceRow
            key={namespace.id}
            namespace={namespace}
            roleIcon={getRoleIcon(userRole)}
            currentUserRole={userRole}
            onClick={() => onNamespaceClick(namespace.id)}
            onDelete={() => onDelete(namespace.id)}
            isEditMode={isEditMode}
          />
        );
      })}
    </div>
  );
} 