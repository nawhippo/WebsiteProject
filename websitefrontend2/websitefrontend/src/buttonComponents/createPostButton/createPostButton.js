import React, {useEffect, useState} from 'react';
import {useUserContext} from '../../pages/usercontext/UserContext';
import '../../global.css';
import './CreatePostButton.css';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';

const CreatePostButton = () => {
  const { user } = useUserContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [publicStatus, setPublicStatus] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [triggerPostCreation, setTriggerPostCreation] = useState(false);

  const handlePublicStatusToggle = () => {
    setPublicStatus(!publicStatus);
  };

  useEffect(() => {
    const createPost = async () => {
      console.log('useEffect triggered', { triggerPostCreation, images });
      if (triggerPostCreation && images.length > 0) {
        await handleCreatePost();
        setTriggerPostCreation(false); // Reset the trigger
      }
    };

    createPost();
  }, [triggerPostCreation, images]);


  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        let base64 = fileReader.result;
        // Extract the base64 part only
        base64 = base64.split(',')[1];
        resolve(base64);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files);
    console.log(selectedImages)
    const base64Images = await Promise.all(selectedImages.map(async (file) => {
      return await convertToBase64(file);
    }));
    console.log(base64Images)
    // Set the images state with base64Images
    setImages(base64Images);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const buttonStyle = {
    backgroundColor: user && user.backgroundColor ? user.backgroundColor : 'grey',
    color: '#FFFFFF',
    border: '4px solid black',
  };
  const handleCreatePost = async () => {
    const postBody = {
      post: {
        title,
        description,
        friendsOnly: !publicStatus,
        posterUsername: user.username,
      },
      images: images
    };

    try {
      console.log('Sending post request', postBody);
      const response = await fetch(`/api/post/${user.appUserID}/createPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody) // send as JSON
      });

      const responseData = await response.json();
      if (response.ok) {
        setMessage('Post created successfully!');
        setTitle('');
        setDescription('');
        setImages([]);
        setShowForm(false);
      } else {
        setMessage('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage('An error occurred while creating the post.');
    }
  };


  return (
      <div className="create-post-container">
        <button className="button" onClick={toggleForm} style={buttonStyle}>Create Post</button>
        {showForm && (
            <div className="form-container">
              <input
                  style={{width: '475px'}}
                  className="post-input"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
              <textarea style={{width: '475px'}}
                  className="post-textarea"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
              <div className="public-status-icon" onClick={handlePublicStatusToggle}>
                {publicStatus ? <PublicIcon /> : <PublicOffIcon />}
                <span>{publicStatus ? 'Public' : 'Private'}</span>
              </div>
              <input style={{...buttonStyle}}
                  id="image-upload"
                  className="post-image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
              />
              <label htmlFor="image-upload" className="image-upload-label">Upload Image</label>
              <button className="button" onClick={() => setTriggerPostCreation(true)} style={{...buttonStyle, transform: 'translateX(90px)'}}>Submit Post</button>
              {message && <p className="create-post-message">{message}</p>}
            </div>
        )}
      </div>
  );
};

export default CreatePostButton;