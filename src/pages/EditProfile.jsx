import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/editProfile/ProfileForm';
import PasswordForm from '../components/editProfile/PasswordForm';

export default function EditProfile() {
  const { user, updateUserProfile, changePassword } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [messages, setMessages] = useState({
    profile: { error: '', success: '' },
    password: { error: '', success: '' },
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessages((prev) => ({
      ...prev,
      profile: { error: '', success: '' },
    }));

    try {
      const formData = new FormData(e.target);
      await updateUserProfile({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
      });

      setMessages((prev) => ({
        ...prev,
        profile: {
          error: '',
          success:
            'Your profile has been updated successfully! The changes will be reflected immediately.',
        },
      }));

      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          profile: { error: '', success: '' },
        }));
      }, 5000);
    } catch (err) {
      console.error('Update profile error:', err);
      setMessages((prev) => ({
        ...prev,
        profile: {
          error: err.message.includes('Firebase')
            ? 'We encountered an error while updating your profile. Please try again.'
            : err.message,
          success: '',
        },
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setMessages((prev) => ({
      ...prev,
      password: { error: '', success: '' },
    }));

    try {
      const formData = new FormData(e.target);
      const currentPassword = formData.get('currentPassword');
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      await changePassword(currentPassword, newPassword);

      setMessages((prev) => ({
        ...prev,
        password: {
          error: '',
          success:
            'Your password has been changed successfully! You can now use your new password to sign in.',
        },
      }));

      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          password: { error: '', success: '' },
        }));
      }, 5000);

      e.target.reset();
    } catch (err) {
      console.error('Change password error:', err);
      setMessages((prev) => ({
        ...prev,
        password: {
          error:
            err.message === 'Current password is incorrect'
              ? 'The current password you entered is incorrect. Please try again.'
              : 'We encountered an error while changing your password. Please try again.',
          success: '',
        },
      }));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="p-6">
      <ProfileForm
        user={user}
        isUpdating={isUpdating}
        messages={messages.profile}
        onUpdateProfile={handleUpdateProfile}
      />
      <PasswordForm
        isChangingPassword={isChangingPassword}
        messages={messages.password}
        onChangePassword={handleChangePassword}
      />
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}