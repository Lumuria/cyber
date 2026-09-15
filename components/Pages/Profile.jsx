import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    AtSign,
    Heart,
    Edit3,
    Save,
    X,
    Loader2,
    ArrowLeft,
    Camera,
    Lock,
    Eye,
    EyeOff,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';

import '../Style/Profile.css';
import { API_URL } from '../../services/apiConfig';

export default function Profile() {
    const { user, login } = useAuth();
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const isArabic = i18n.language?.startsWith('ar');

    const [profile, setProfile] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likesLoading, setLikesLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const getToken = () => {
        return localStorage.getItem('auth_token');
    };

    /*
     * Password error translations
     * The key is stored instead of the translated text,
     * so the message changes immediately with the language.
     */
    const getPasswordErrorMessage = (errorKey) => {
        switch (errorKey) {
            case 'PASSWORD_REUSE_CURRENT':
                return isArabic
                    ? 'لا يمكنك استخدام كلمة المرور الحالية مرة أخرى.'
                    : 'You cannot reuse your current password.';

            case 'PASSWORD_REUSE_PREVIOUS':
                return isArabic
                    ? 'لا يمكنك استخدام كلمة مرور سابقة مرة أخرى.'
                    : 'You cannot reuse a previous password.';

            case 'PASSWORD_CURRENT_INCORRECT':
                return isArabic
                    ? 'كلمة المرور الحالية غير صحيحة.'
                    : 'Current password is incorrect.';

            case 'PASSWORD_GENERAL_ERROR':
                return isArabic
                    ? 'حدث خطأ أثناء تغيير كلمة المرور.'
                    : 'Something went wrong while changing your password.';

            case 'PASSWORD_FIELDS_REQUIRED':
                return isArabic
                    ? 'يرجى تعبئة جميع حقول كلمة المرور.'
                    : 'Please fill in all password fields.';

            case 'PASSWORD_TOO_SHORT':
                return isArabic
                    ? 'كلمة المرور الجديدة يجب أن تتكون من 6 أحرف على الأقل.'
                    : 'The new password must be at least 6 characters.';

            case 'PASSWORD_MISMATCH':
                return isArabic
                    ? 'كلمتا المرور غير متطابقتين.'
                    : 'The passwords do not match.';

            default:
                return errorKey;
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        loadProfile();
        loadLikedPosts();
    }, [user]);

    const loadProfile = async () => {
        const token = getToken();

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch(
                `${API_URL}/profile`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    'Failed to load profile'
                );
            }

            const currentUser = data.user;

            setProfile(currentUser);

            setForm({
                name: currentUser.name || '',
                username: currentUser.username || '',
                email: currentUser.email || '',
            });

            setAvatarPreview(
                currentUser.avatar || null
            );
        } catch (err) {
            console.error(
                'Load profile error:',
                err
            );

            setError(
                isArabic
                    ? 'تعذر تحميل الملف الشخصي.'
                    : 'Unable to load profile.'
            );
        } finally {
            setLoading(false);
        }
    };

    const loadLikedPosts = async () => {
        const token = getToken();

        if (!token) {
            return;
        }

        try {
            setLikesLoading(true);

            const response = await fetch(
                `${API_URL}/profile/likes`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    'Failed to load liked posts'
                );
            }

            setLikedPosts(
                Array.isArray(data.posts)
                    ? data.posts
                    : []
            );
        } catch (err) {
            console.error(
                'Load liked posts error:',
                err
            );

            setLikedPosts([]);
        } finally {
            setLikesLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError(
                isArabic
                    ? 'يرجى اختيار صورة صحيحة.'
                    : 'Please select a valid image.'
            );
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError(
                isArabic
                    ? 'حجم الصورة يجب ألا يتجاوز 2 ميغابايت.'
                    : 'Image size must not exceed 2 MB.'
            );
            return;
        }

        setError('');
        setMessage('');

        setAvatarFile(file);

        setAvatarPreview(
            URL.createObjectURL(file)
        );
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const token = getToken();

        if (!token) {
            navigate('/login');
            return;
        }

        setMessage('');
        setError('');

        const trimmedName = form.name.trim();
        const trimmedUsername =
            form.username.trim().toLowerCase();
        const trimmedEmail =
            form.email.trim().toLowerCase();

        if (
            !trimmedName ||
            !trimmedUsername ||
            !trimmedEmail
        ) {
            setError(
                isArabic
                    ? 'يرجى تعبئة جميع الحقول.'
                    : 'Please fill in all fields.'
            );
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append(
                'name',
                trimmedName
            );

            formData.append(
                'username',
                trimmedUsername
            );

            formData.append(
                'email',
                trimmedEmail
            );

            if (avatarFile) {
                formData.append(
                    'avatar',
                    avatarFile
                );
            }

            const response = await fetch(
                `${API_URL}/profile`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'X-HTTP-Method-Override': 'PUT',
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const validationMessage =
                    data?.errors
                        ? Object.values(data.errors)
                            .flat()
                            .join(' ')
                        : data?.message;

                throw new Error(
                    validationMessage ||
                    'Failed to update profile'
                );
            }

            const updatedUser = data.user;

            setProfile(updatedUser);

            setForm({
                name: updatedUser.name || '',
                username:
                    updatedUser.username || '',
                email:
                    updatedUser.email || '',
            });

            setAvatarPreview(
                updatedUser.avatar || null
            );

            setAvatarFile(null);

            login({
                id: updatedUser.id,
                name: updatedUser.name,
                username:
                    updatedUser.username,
                email: updatedUser.email,
                avatar:
                    updatedUser.avatar || null,
                role:
                    updatedUser.role || 'member',
                isAdmin: Boolean(
                    updatedUser.is_admin
                ),
                permissions:
                    Array.isArray(
                        updatedUser.permissions
                    )
                        ? updatedUser.permissions
                        : [],
                token,
            });

            setEditing(false);

            setMessage(
                isArabic
                    ? 'تم تحديث معلومات الحساب بنجاح.'
                    : 'Profile updated successfully.'
            );
        } catch (err) {
            console.error(
                'Update profile error:',
                err
            );

            setError(
                err.message ||
                (isArabic
                    ? 'حدث خطأ أثناء تحديث الحساب.'
                    : 'Something went wrong while updating your profile.')
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (!profile) {
            return;
        }

        setForm({
            name: profile.name || '',
            username: profile.username || '',
            email: profile.email || '',
        });

        setAvatarFile(null);

        setAvatarPreview(
            profile.avatar || null
        );

        setEditing(false);
        setMessage('');
        setError('');
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();

        const token = getToken();

        if (!token) {
            navigate('/login');
            return;
        }

        setPasswordMessage('');
        setPasswordError('');

        const {
            current_password,
            password,
            password_confirmation,
        } = passwordForm;

        if (
            !current_password ||
            !password ||
            !password_confirmation
        ) {
            setPasswordError(
                'PASSWORD_FIELDS_REQUIRED'
            );
            return;
        }

        if (password.length < 6) {
            setPasswordError(
                'PASSWORD_TOO_SHORT'
            );
            return;
        }

        if (password !== password_confirmation) {
            setPasswordError(
                'PASSWORD_MISMATCH'
            );
            return;
        }

        try {
            setPasswordSaving(true);

            const response = await fetch(
                `${API_URL}/change-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        current_password,
                        password,
                        password_confirmation,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const backendMessage =
                    data?.errors
                        ? Object.values(data.errors)
                            .flat()
                            .join(' ')
                        : data?.message || '';

                if (
                    backendMessage ===
                    'You cannot reuse your current password.'
                ) {
                    setPasswordError(
                        'PASSWORD_REUSE_CURRENT'
                    );
                } else if (
                    backendMessage ===
                    'You cannot reuse a previous password.' ||
                    backendMessage ===
                    'You cannot reuse previous password.'
                ) {
                    setPasswordError(
                        'PASSWORD_REUSE_PREVIOUS'
                    );
                } else if (
                    backendMessage ===
                    'Current password is incorrect.'
                ) {
                    setPasswordError(
                        'PASSWORD_CURRENT_INCORRECT'
                    );
                } else {
                    setPasswordError(
                        'PASSWORD_GENERAL_ERROR'
                    );
                }

                return;
            }

            setPasswordForm({
                current_password: '',
                password: '',
                password_confirmation: '',
            });

            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);

            setChangingPassword(false);

            setPasswordMessage(
                'PASSWORD_SUCCESS'
            );
        } catch (err) {
            console.error(
                'Change password error:',
                err
            );

            setPasswordError(
                'PASSWORD_GENERAL_ERROR'
            );
        } finally {
            setPasswordSaving(false);
        }
    };

    const handleCancelPasswordChange = () => {
        setPasswordForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setChangingPassword(false);

        setPasswordMessage('');
        setPasswordError('');
    };

    const formatDate = (date) => {
        if (!date) {
            return '';
        }

        try {
            return new Date(date).toLocaleDateString(
                isArabic ? 'ar-SA' : 'en-US',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
            );
        } catch {
            return '';
        }
    };

    if (loading) {
        return (
            <section className="profile-page">
                <div className="profile-loading">
                    <Loader2
                        size={32}
                        className="profile-spinner"
                    />

                    <span>
                        {isArabic
                            ? 'جاري تحميل الملف الشخصي...'
                            : 'Loading profile...'}
                    </span>
                </div>
            </section>
        );
    }

    if (!user || !profile) {
        return null;
    }

    const profileAvatar =
        avatarPreview ||
        profile.avatar ||
        null;

    const avatarLetter = (
        profile.username ||
        profile.name ||
        'U'
    )
        .charAt(0)
        .toUpperCase();

    return (
        <section className="profile-page">
            <div className="container profile-container">

                <button
                    type="button"
                    className="profile-back-btn"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={17} />

                    <span>
                        {isArabic
                            ? 'العودة للموقع'
                            : 'Back to website'}
                    </span>
                </button>

                <div className="profile-heading">
                    <div className="profile-avatar-wrapper">

                        {profileAvatar ? (
                            <img
                                src={profileAvatar}
                                alt={
                                    profile.username ||
                                    profile.name
                                }
                                className="profile-avatar-large profile-avatar-image"
                            />
                        ) : (
                            <div className="profile-avatar-large">
                                {avatarLetter}
                            </div>
                        )}

                        {editing && (
                            <label
                                htmlFor="profile-avatar"
                                className="profile-avatar-edit"
                                title={
                                    isArabic
                                        ? 'تغيير الصورة'
                                        : 'Change photo'
                                }
                            >
                                <Camera size={15} />

                                <input
                                    id="profile-avatar"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        handleAvatarChange
                                    }
                                />
                            </label>
                        )}
                    </div>

                    <div>
                        <h1>
                            {isArabic
                                ? 'الملف الشخصي'
                                : 'My Profile'}
                        </h1>

                        <p>
                            {isArabic
                                ? 'إدارة معلومات حسابك والمنشورات التي أعجبت بها'
                                : 'Manage your account information and liked posts.'}
                        </p>
                    </div>
                </div>

                {/* General profile messages only */}
                {message && (
                    <div className="profile-message success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="profile-message error">
                        {error}
                    </div>
                )}

                <div className="profile-grid">

                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div>
                                <h2>
                                    {isArabic
                                        ? 'معلومات الحساب'
                                        : 'Account Information'}
                                </h2>

                                <p>
                                    {isArabic
                                        ? 'معلوماتك الشخصية'
                                        : 'Your personal information'}
                                </p>
                            </div>

                            {!editing && (
                                <button
                                    type="button"
                                    className="profile-edit-btn"
                                    onClick={() => {
                                        setEditing(true);
                                        setMessage('');
                                        setError('');
                                    }}
                                >
                                    <Edit3 size={16} />

                                    <span>
                                        {isArabic
                                            ? 'تعديل'
                                            : 'Edit'}
                                    </span>
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <form
                                className="profile-form"
                                onSubmit={handleSave}
                            >
                                <div className="profile-field">
                                    <label htmlFor="profile-name">
                                        <User size={16} />

                                        {isArabic
                                            ? 'الاسم'
                                            : 'Name'}
                                    </label>

                                    <input
                                        id="profile-name"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="name"
                                    />
                                </div>

                                <div className="profile-field">
                                    <label htmlFor="profile-username">
                                        <AtSign size={16} />

                                        {isArabic
                                            ? 'اسم المستخدم'
                                            : 'Username'}
                                    </label>

                                    <input
                                        id="profile-username"
                                        type="text"
                                        name="username"
                                        value={
                                            form.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="username"
                                    />
                                </div>

                                <div className="profile-field">
                                    <label htmlFor="profile-email">
                                        <Mail size={16} />

                                        {isArabic
                                            ? 'البريد الإلكتروني'
                                            : 'Email'}
                                    </label>

                                    <input
                                        id="profile-email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={
                                            handleChange
                                        }
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="profile-form-actions">
                                    <button
                                        type="submit"
                                        className="profile-save-btn"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <Loader2
                                                size={16}
                                                className="profile-spinner"
                                            />
                                        ) : (
                                            <Save size={16} />
                                        )}

                                        <span>
                                            {saving
                                                ? isArabic
                                                    ? 'جاري الحفظ...'
                                                    : 'Saving...'
                                                : isArabic
                                                    ? 'حفظ التغييرات'
                                                    : 'Save Changes'}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-cancel-btn"
                                        onClick={
                                            handleCancel
                                        }
                                        disabled={saving}
                                    >
                                        <X size={16} />

                                        <span>
                                            {isArabic
                                                ? 'إلغاء'
                                                : 'Cancel'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-info">

                                <div className="profile-info-row">
                                    <div className="profile-info-icon">
                                        <User size={18} />
                                    </div>

                                    <div>
                                        <span>
                                            {isArabic
                                                ? 'الاسم'
                                                : 'Name'}
                                        </span>

                                        <strong>
                                            {profile.name}
                                        </strong>
                                    </div>
                                </div>

                                <div className="profile-info-row">
                                    <div className="profile-info-icon">
                                        <AtSign size={18} />
                                    </div>

                                    <div>
                                        <span>
                                            {isArabic
                                                ? 'اسم المستخدم'
                                                : 'Username'}
                                        </span>

                                        <strong>
                                            @{profile.username}
                                        </strong>
                                    </div>
                                </div>

                                <div className="profile-info-row">
                                    <div className="profile-info-icon">
                                        <Mail size={18} />
                                    </div>

                                    <div>
                                        <span>
                                            {isArabic
                                                ? 'البريد الإلكتروني'
                                                : 'Email'}
                                        </span>

                                        <strong>
                                            {profile.email}
                                        </strong>
                                    </div>
                                </div>

                                {profile.email_verified_at && (
                                    <div className="profile-verified">
                                        ✓{' '}
                                        {isArabic
                                            ? 'البريد الإلكتروني موثق'
                                            : 'Email verified'}
                                    </div>
                                )}

                            </div>
                        )}
                    </div>

                    <div className="profile-card profile-summary-card">
                        <div className="profile-summary-icon">
                            <Heart size={24} />
                        </div>

                        <span className="profile-summary-label">
                            {isArabic
                                ? 'المنشورات التي أعجبت بها'
                                : 'Liked Posts'}
                        </span>

                        <strong className="profile-summary-number">
                            {likedPosts.length}
                        </strong>

                        <p>
                            {isArabic
                                ? 'إجمالي المنشورات التي قمت بالإعجاب بها'
                                : 'Total posts you have liked.'}
                        </p>
                    </div>

                </div>

                {/* =========================
                    Change Password
                ========================= */}

                <div className="profile-card password-card">

                    <div className="profile-card-header">
                        <div>
                            <h2>
                                <Lock size={20} />

                                {isArabic
                                    ? 'تغيير كلمة المرور'
                                    : 'Change Password'}
                            </h2>

                            <p>
                                {isArabic
                                    ? 'قم بتحديث كلمة المرور الخاصة بحسابك.'
                                    : 'Update the password for your account.'}
                            </p>
                        </div>

                        {!changingPassword && (
                            <button
                                type="button"
                                className="profile-edit-btn"
                                onClick={() => {
                                    setChangingPassword(true);

                                    setMessage('');
                                    setError('');

                                    setPasswordMessage('');
                                    setPasswordError('');
                                }}
                            >
                                <Lock size={16} />

                                <span>
                                    {isArabic
                                        ? 'تغيير'
                                        : 'Change'}
                                </span>
                            </button>
                        )}
                    </div>

                    {changingPassword && (
                        <form
                            className="profile-form"
                            onSubmit={
                                handlePasswordChange
                            }
                        >

                            {/* Current Password */}
                            <div className="profile-field">

                                <label htmlFor="current-password">
                                    <Lock size={16} />

                                    {isArabic
                                        ? 'كلمة المرور الحالية'
                                        : 'Current Password'}
                                </label>

                                <div className="profile-password-wrapper">

                                    <input
                                        id="current-password"
                                        type={
                                            showCurrentPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={
                                            passwordForm.current_password
                                        }
                                        onChange={(e) =>
                                            setPasswordForm(
                                                (current) => ({
                                                    ...current,
                                                    current_password:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        autoComplete="current-password"
                                        disabled={
                                            passwordSaving
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="profile-password-toggle"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        disabled={
                                            passwordSaving
                                        }
                                        aria-label={
                                            showCurrentPassword
                                                ? isArabic
                                                    ? 'إخفاء كلمة المرور'
                                                    : 'Hide password'
                                                : isArabic
                                                    ? 'إظهار كلمة المرور'
                                                    : 'Show password'
                                        }
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* New Password */}
                            <div className="profile-field">

                                <label htmlFor="new-password">
                                    <Lock size={16} />

                                    {isArabic
                                        ? 'كلمة المرور الجديدة'
                                        : 'New Password'}
                                </label>

                                <div className="profile-password-wrapper">

                                    <input
                                        id="new-password"
                                        type={
                                            showNewPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={
                                            passwordForm.password
                                        }
                                        onChange={(e) =>
                                            setPasswordForm(
                                                (current) => ({
                                                    ...current,
                                                    password:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        autoComplete="new-password"
                                        disabled={
                                            passwordSaving
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="profile-password-toggle"
                                        onClick={() =>
                                            setShowNewPassword(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        disabled={
                                            passwordSaving
                                        }
                                        aria-label={
                                            showNewPassword
                                                ? isArabic
                                                    ? 'إخفاء كلمة المرور'
                                                    : 'Hide password'
                                                : isArabic
                                                    ? 'إظهار كلمة المرور'
                                                    : 'Show password'
                                        }
                                    >
                                        {showNewPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="profile-field">

                                <label htmlFor="confirm-password">
                                    <Lock size={16} />

                                    {isArabic
                                        ? 'تأكيد كلمة المرور الجديدة'
                                        : 'Confirm New Password'}
                                </label>

                                <div className="profile-password-wrapper">

                                    <input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={
                                            passwordForm.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setPasswordForm(
                                                (current) => ({
                                                    ...current,
                                                    password_confirmation:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        autoComplete="new-password"
                                        disabled={
                                            passwordSaving
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="profile-password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        disabled={
                                            passwordSaving
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? isArabic
                                                    ? 'إخفاء كلمة المرور'
                                                    : 'Hide password'
                                                : isArabic
                                                    ? 'إظهار كلمة المرور'
                                                    : 'Show password'
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Password Message */}
                            {passwordError && (
                                <div className="password-form-message error">
                                    {getPasswordErrorMessage(
                                        passwordError
                                    )}
                                </div>
                            )}

                            {passwordMessage && (
                                <div className="password-form-message success">
                                    {isArabic
                                        ? 'تم تغيير كلمة المرور بنجاح.'
                                        : 'Password changed successfully.'}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="profile-form-actions">

                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                    disabled={
                                        passwordSaving
                                    }
                                >
                                    {passwordSaving ? (
                                        <Loader2
                                            size={16}
                                            className="profile-spinner"
                                        />
                                    ) : (
                                        <Save size={16} />
                                    )}

                                    <span>
                                        {passwordSaving
                                            ? isArabic
                                                ? 'جاري التغيير...'
                                                : 'Changing...'
                                            : isArabic
                                                ? 'تغيير كلمة المرور'
                                                : 'Change Password'}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={
                                        handleCancelPasswordChange
                                    }
                                    disabled={
                                        passwordSaving
                                    }
                                >
                                    <X size={16} />

                                    <span>
                                        {isArabic
                                            ? 'إلغاء'
                                            : 'Cancel'}
                                    </span>
                                </button>

                            </div>
                        </form>
                    )}
                </div>

                {/* =========================
                    Liked Posts
                ========================= */}

                <div className="profile-card liked-posts-card">

                    <div className="profile-card-header">
                        <div>
                            <h2>
                                <Heart size={20} />

                                {isArabic
                                    ? 'المنشورات التي أعجبت بها'
                                    : 'Liked Posts'}
                            </h2>

                            <p>
                                {isArabic
                                    ? 'المنشورات التي قمت بالإعجاب بها'
                                    : 'Posts you have liked.'}
                            </p>
                        </div>
                    </div>

                    {likesLoading ? (
                        <div className="liked-posts-loading">

                            <Loader2
                                size={26}
                                className="profile-spinner"
                            />

                            <span>
                                {isArabic
                                    ? 'جاري تحميل المنشورات...'
                                    : 'Loading posts...'}
                            </span>

                        </div>
                    ) : likedPosts.length === 0 ? (
                        <div className="liked-posts-empty">

                            <Heart size={38} />

                            <h3>
                                {isArabic
                                    ? 'لا توجد منشورات بعد'
                                    : 'No liked posts yet'}
                            </h3>

                            <p>
                                {isArabic
                                    ? 'عندما تعجبك منشورات، ستظهر هنا.'
                                    : 'Posts you like will appear here.'}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/posts')
                                }
                                className="profile-posts-btn"
                            >
                                {isArabic
                                    ? 'تصفح المنشورات'
                                    : 'Browse Posts'}
                            </button>

                        </div>
                    ) : (
                        <div className="liked-posts-list">

                            {likedPosts.map((post) => (
                                <article
                                    className="liked-post"
                                    key={post.id}
                                >

                                    <div className="liked-post-content">

                                        <h3>
                                            {post.title}
                                        </h3>

                                        {post.body && (
                                            <p className="liked-post-body">
                                                {post.body}
                                            </p>
                                        )}

                                        <div className="liked-post-meta">

                                            {post.user && (
                                                <span>
                                                    @
                                                    {post.user
                                                        .username ||
                                                        post.user.name ||
                                                        'User'}
                                                </span>
                                            )}

                                            {post.created_at && (
                                                <span>
                                                    {formatDate(
                                                        post.created_at
                                                    )}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="liked-post-heart">
                                        <Heart
                                            size={20}
                                            fill="currentColor"
                                        />
                                    </div>

                                </article>
                            ))}

                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}