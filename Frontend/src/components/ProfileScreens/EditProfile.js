import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineUpload } from 'react-icons/ai';
import Loader from '../GeneralScreens/Loader';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import '../../Css/EditProfile.css';

const EditProfile = () => {
  const { activeUser, updateUserProfile, config } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [previousPhoto, setPreviousPhoto] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (activeUser) {
      setUsername(activeUser.username || '');
      setEmail(activeUser.email || '');
      setPreviousPhoto(activeUser.photo || '');
      console.log(previousPhoto)
      setLoading(false);
    }
  }, [activeUser]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  if (photoFile) formData.append('photo', photoFile);

  try {
    setLoading(true);
    setError('');
    setSuccess('');

    const { data } = await axios.patch(
      'https://vichaar-blog.onrender.com/user/editProfile',
      formData,
      config
    );

    // ✅ Use server-provided message if available
    setSuccess(data.message || 'Profile updated successfully!');
    // updateUserProfile(data.updatedUser);

    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  } catch (err) {
    setError(err.response?.data?.error || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


  if (loading) return <Loader />;

  return (
    <div className="Inclusive-editprofile-page">
      <form onSubmit={handleSubmit}>
        {error && <div className="error_msg">{error}</div>}
        {success && <div className="success_msg">{success}</div>}

        <div className="input-wrapper">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="username">Username</label>
        </div>

        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="profile-img-upld-wrapper">
          <div className="ProfilePhotoField">
            <FaUserAlt />
            <div className="txt">
              {photoFile ? (
                photoFile.name
              ) : (
                <div>
                  <AiOutlineUpload />
                  <span>Change Profile Photo</span>
                </div>
              )}
            </div>
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPhotoFile(file);
              }}
            />
          </div>

          {previousPhoto && (
            <div className="currentImage">
              <div className="absolute">Current Image</div>
              <img
                src={`${previousPhoto}`}
                alt="Current Profile"
                width="100"
              />
            </div>
          )}
        </div>

        <button type="submit" className="editprofile-btn">
          Edit Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
