export const API = {
  // Endpoints para cursos
  GET_COURSE: courseId => `${process.env.REACT_APP_API_URL}courses/${courseId}`,

  // Endpoints para usuarios
  GET_USER: userEmail => `${process.env.REACT_APP_API_URL}users/email/${userEmail}`,
  POST_USER: () => `${process.env.REACT_APP_API_URL}users/`,
  DELETE_USER: userId => `${process.env.REACT_APP_API_URL}users/${userId}`,
  PUT_USER: userId => `${process.env.REACT_APP_API_URL}users/${userId}`,

  // Endpoints para horarios de disponibilidad
  GET_AVAILABILITIES: () => `${process.env.REACT_APP_API_URL}availabilities/`,
  POST_AVAILABILITIES: () => `${process.env.REACT_APP_API_URL}availabilities/`,
  GET_AVAILABILITIES_USER: userId => `${process.env.REACT_APP_API_URL}availabilities/${userId}`,
  PUT_AVAILABILITIES: availabilityId => `${process.env.REACT_APP_API_URL}availabilities/${availabilityId}`,
  DELETE_AVAILABILITIES: availabilityId => `${process.env.REACT_APP_API_URL}availabilities/${availabilityId}`,
};
export default API;