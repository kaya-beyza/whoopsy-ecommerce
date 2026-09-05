export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && window.location.hostname !== 'localhost') ? '/api' : 'http://localhost:5277/api',
  cloudinaryCloudName: 'dog06yvq9',
  cdnUrl: 'https://res.cloudinary.com/dog06yvq9/image/upload'
};
