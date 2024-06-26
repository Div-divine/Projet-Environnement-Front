import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Resizer from 'react-image-file-resizer';
import SideBar from '../Menus/SideBarMenu';
import DisplayConnectedSmallMenu from '../Menus/DisplaySmallScreenConnectedMenu';
import uploadImage from '../../api/UploadImageApi';
import sendUsrImgDb from '../../api/SendUserImageApi';
import useUserData from '../../api/UserInfoApi';
import { generateNonce } from '../../generate-nonce/nonce';
import { useCsrf } from '../../context/CsrfContext';

const FileUploadForm = () => {
  const csrfToken = useCsrf()
  const nonce = generateNonce()
  const [imagePreview, setImagePreview] = useState(null); // State for preview image
  const [imageError, setImageError] = useState(null); // State for image error message
  const [submittedImage, setSubmittedImage] = useState(null); // State for submitted image
  const [imageSize, setImageSize] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(false)
  const [fileUploadSuccessMsg, setFileUploadSuccessMsg] = useState('')
  const [imgName, setImgName] = useState('');
  const [userId, setUserId] = useState(null);
  const userData = useUserData()

  useEffect(() => {
    if (userData) {
      setUserId(userData.user_id)
    }
  }, [userData]);

  useEffect(() => {
    if (userId && imgName && csrfToken) {
      async function addUsrImgToDb(data, csrf) {
        const response = await sendUsrImgDb(data, csrf)
        return response;
      }
      const data = { userId, imageName: imgName }

      addUsrImgToDb(data, csrfToken)
    }
  }, [userId, imgName, csrfToken])

  const sanitizeFileName = (fileName) => {
    return fileName
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove special characters except for dot and hyphen
  };

  const onDrop = (acceptedFiles) => {
    let file = acceptedFiles[0];
    setImageError(null); // Clear previous error on new file selection
    setFileUploadSuccess(false)

    if (!file) {
      return; // Handle potential empty file selection
    }

    // Sanitize the file name
    const sanitizedFileName = sanitizeFileName(file.name);
    file = new File([file], sanitizedFileName, { type: file.type });

    setImageSize(file.size); // Set the file size

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Le fichier est trop volumineux (maximum 2 Mo)');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setImageError('Seuls les images JPEG et PNG sont autorisées');
      return;
    }

    // Resize image using Resizer (optional, adjust parameters as needed)
    Resizer.imageFileResizer(
      file,
      400, // Max width
      400, // Max height
      'JPEG', // Output format
      80, // Quality
      0, // Rotation
      (uri) => {
        setImagePreview(uri);
      },
      'base64' // Output type
    );

    setSubmittedImage(file); // Set the sanitized file to the state
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e, submittedImage, userId, csrf) => {
    e.preventDefault();
    if (submittedImage && userId && csrf) {
      // Here you can access the submitted image and its path
      console.log('Submitted image:', submittedImage);
      try {
        // Create FormData object
        const formData = new FormData();
        formData.append('file', submittedImage); // Append the image file
        const response = await uploadImage(userId, formData, csrf)
        console.log('File uploaded is:', response)
        if (response.message == 'File uploaded successfully') {
          setImgName(response.filename)
          setFileUploadSuccess(true)
          setFileUploadSuccessMsg('Upload fait avec success!')
          window.location.href='/parametre?upload-img-success=true'
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error
      }
    }
  };

  return (
    <>
      <SideBar />
      <main className="unread-msg-main-container">
        <DisplayConnectedSmallMenu />
        <div className='setting-section-container unread-msg-and-users-container'>
          { userId && csrfToken && <form onSubmit={(e) => handleSubmit(e, submittedImage, userId, csrfToken)}>
            <div {...getRootProps()} style={{ border: '1px dashed gray', padding: '20px'}} nonce={nonce}>
              <input {...getInputProps()} onChange={(event) => setSubmittedImage(event.target.files[0])} />
              <p>Glisser et déposer un fichier ici, ou cliquer pour sélectionner</p>
            </div>
            {imagePreview && (
              <div>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            {imageSize && (
              <div>
                <p>Taille de l'image: {(imageSize / 1024).toFixed(2)} KB</p>
              </div>
            )}
            {imageError && <div style={{ color: 'red'}} nonce={nonce}>{imageError}</div>}
            {!fileUploadSuccess && <input type="submit" value='Envoyer' />}
            {fileUploadSuccess && fileUploadSuccessMsg ? <div>{fileUploadSuccessMsg}</div> : ''}
          </form>}
        </div>
      </main>
    </>
  );
};

export default FileUploadForm;
