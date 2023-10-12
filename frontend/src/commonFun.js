import {uploadImg} from './ApiService/_requests'

export const errorContainer = (form, field) => {
  return form.touched[field] && form.errors[field] ? <span className='error text-danger'>{form.errors[field]}</span> : null
}

export const formAttr = (form, field) => ({onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field]})

export const handleImageUpload = async (file, setImgUrl) => {
  const formData = new FormData()
  formData.append('image', file)
  const {data} = await uploadImg(formData)
  setImgUrl(data)
}

// function generateThumbnail() {
//   const videoInput = document.getElementById('videoInput')
//   const thumbnailCanvas = document.getElementById('thumbnailCanvas')
//   const video = document.createElement('video')
//   const canvasContext = thumbnailCanvas.getContext('2d')

//   const file = videoInput.files[0]

//   if (file) {
//     const objectURL = URL.createObjectURL(file)
//     video.src = objectURL

//     video.onloadedmetadata = function () {
//       thumbnailCanvas.width = video.videoWidth
//       thumbnailCanvas.height = video.videoHeight
//       canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

//       // To get the thumbnail as a data URL, you can use toDataURL
//       const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/jpeg') // Change format if needed

//       // Now you can use the 'thumbnailDataUrl' to display the thumbnail or send it to your server
//       console.log(thumbnailDataUrl)

//       // Don't forget to revoke the object URL to free up resources
//       URL.revokeObjectURL(objectURL)
//     }

//     video.onerror = function () {
//       console.error('Error loading video file.')
//     }

//     video.onended = function () {
//       video.currentTime = 0 // Ensure video is reset for future use
//     }

//     video.load()
//   }
// }

// function generateThumbnail() {
//   const videoInput = document.getElementById('videoInput')
//   const thumbnailCanvas = document.getElementById('thumbnailCanvas')
//   const video = document.createElement('video')
//   const canvasContext = thumbnailCanvas.getContext('2d')

//   const file = videoInput.files[0]

//   if (file) {
//     const objectURL = URL.createObjectURL(file)
//     video.src = objectURL

//     video.onloadedmetadata = function () {
//       thumbnailCanvas.width = video.videoWidth
//       thumbnailCanvas.height = video.videoHeight
//       canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

//       // To get the thumbnail as a data URL, you can use toDataURL
//       const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/jpeg') // Change format if needed

//       // Now you can use the 'thumbnailDataUrl' to display the thumbnail or send it to your server
//       console.log(thumbnailDataUrl)

//       // Don't forget to revoke the object URL to free up resources
//       URL.revokeObjectURL(objectURL)
//     }

//     video.onerror = function () {
//       console.error('Error loading video file.')
//     }

//     video.onended = function () {
//       video.currentTime = 0 // Ensure video is reset for future use
//     }

//     video.load()
//   }
// }

// const generateThumbnail = (file) => {
//   const reader = new FileReader()
//   reader.onload = (e) => {
//     const image = new Image()
//     image.src = e.target.result

//     image.onload = () => {
//       const canvas = document.createElement('canvas')
//       const ctx = canvas.getContext('2d')
//       const maxWidth = 100 // Set the maximum width for the thumbnail
//       const maxHeight = 100 // Set the maximum height for the thumbnail
//       let width = image.width
//       let height = image.height

//       if (width > height) {
//         if (width > maxWidth) {
//           height *= maxWidth / width
//           width = maxWidth
//         }
//       } else {
//         if (height > maxHeight) {
//           width *= maxHeight / height
//           height = maxHeight
//         }
//       }

//       canvas.width = width
//       canvas.height = height
//       ctx.drawImage(image, 0, 0, width, height)

//       const thumbnailDataUrl = canvas.toDataURL('image/jpeg') // You can change the format to 'image/png' if needed

//       // Now, you can use the 'thumbnailDataUrl' to display the thumbnail or upload it to your server
//       console.log(thumbnailDataUrl)
//     }
//   }

//   reader.readAsDataURL(file) // Read the selected image file as a Data URL
// }

// function generateThumbnail() {
//   const videoInput = document.getElementById('videoInput')
//   const thumbnailCanvas = document.getElementById('thumbnailCanvas')
//   const canvasContext = thumbnailCanvas.getContext('2d')

//   const file = videoInput.files[0]

//   if (file) {
//     const reader = new FileReader()

//     reader.onload = function (event) {
//       const video = document.createElement('video')
//       video.src = event.target.result

//       video.onloadedmetadata = function () {
//         thumbnailCanvas.width = video.videoWidth
//         thumbnailCanvas.height = video.videoHeight
//         canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

//         // To get the thumbnail as a data URL, you can use toDataURL
//         const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/jpeg') // Change format if needed

//         // Now you can use the 'thumbnailDataUrl' to display the thumbnail or send it to your server
//         console.log(thumbnailDataUrl)
//       }

//       video.onerror = function () {
//         console.error('Error loading video file.')
//       }

//       video.onended = function () {
//         video.currentTime = 0 // Ensure video is reset for future use
//       }

//       video.load()
//     }

//     reader.onerror = function () {
//       console.error('Error reading video file.')
//     }

//     reader.readAsDataURL(file)
//   }
// }

// function handleVideoSelection(event) {
//   const videoInput = event.target
//   const thumbnailCanvas = document.getElementById('thumbnailCanvas')
//   const thumbnailImage = document.getElementById('thumbnailImage')

//   const file = videoInput.files[0]

//   if (file) {
//     const reader = new FileReader()

//     reader.onload = function (e) {
//       const videoDataUrl = e.target.result

//       // Create a video element to capture the video's dimensions
//       const video = document.createElement('video')
//       video.src = videoDataUrl

//       video.onloadedmetadata = function () {
//         thumbnailCanvas.width = video.videoWidth
//         thumbnailCanvas.height = video.videoHeight

//         // Create a canvas context and draw the video frame on it
//         const canvasContext = thumbnailCanvas.getContext('2d')
//         canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

//         // To get the thumbnail as a data URL, you can use toDataURL
//         const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/jpeg') // Change format if needed

//         // Display the thumbnail image
//         thumbnailImage.src = thumbnailDataUrl

//         // Now you can use the 'thumbnailDataUrl' or 'thumbnailImage' to display the thumbnail or send it to your server
//         console.log(thumbnailDataUrl)
//       }

//       video.onerror = function () {
//         console.error('Error loading video file.')
//       }

//       video.onended = function () {
//         video.currentTime = 0 // Ensure video is reset for future use
//       }

//       video.load()
//     }

//     reader.readAsDataURL(file)
//   }
// }

// function VideoThumbnailGenerator() {
//   const [thumbnail, setThumbnail] = useState('');

//   const handleFileChange = (e) => {
//     const videoFile = e.target.files[0];

//     if (videoFile) {
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         const videoBlob = new Blob([event.target.result], { type: videoFile.type });
//         const videoUrl = URL.createObjectURL(videoBlob);

//         // Create a video element to seek to a specific time
//         const videoElement = document.createElement('video');
//         videoElement.src = videoUrl;

//         videoElement.onloadedmetadata = () => {
//           // Seek to a specific time (e.g., 5 seconds)
//           videoElement.currentTime = 5;

//           // Create a canvas to capture the frame as an image
//           const canvas = document.createElement('canvas');
//           canvas.width = videoElement.videoWidth;
//           canvas.height = videoElement.videoHeight;

//           const context = canvas.getContext('2d');
//           context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

//           // Convert the canvas content to a data URL (thumbnail)
//           const thumbnailDataUrl = canvas.toDataURL('image/jpeg'); // Change format if needed

//           // Set the thumbnail in the state
//           setThumbnail(thumbnailDataUrl);

//           // Clean up
//           URL.revokeObjectURL(videoUrl);
//         };

//         videoElement.src = videoUrl;
//       };

//       reader.readAsArrayBuffer(videoFile);
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="video/*" onChange={handleFileChange} />
//       {thumbnail && <img src={thumbnail} alt="Video Thumbnail" />}
//     </div>
//   );
// }
