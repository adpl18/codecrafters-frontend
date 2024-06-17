export const API = {
  // Endpoints para cursos
  GET_COURSES: () => `${process.env.REACT_APP_API_URL}/courses`,
  GET_COURSE: courseId => `${process.env.REACT_APP_API_URL}courses/${courseId}`,

  // Endpoints para usuarios
  GET_USER: userId => `${process.env.REACT_APP_API_URL}users/${userId}`,

  // Endpoints para horarios de disponibilidad
  GET_AVAILABILITIES: () => `${process.env.REACT_APP_API_URL}availabilities/`,
  POST_AVAILABILITIES: () => `${process.env.REACT_APP_API_URL}availabilities/`,
  GET_AVAILABILITIES_USER: userId => `${process.env.REACT_APP_API_URL}availabilities/${userId}`,
  PUT_AVAILABILITIES: availabilityId => `${process.env.REACT_APP_API_URL}availabilities/${availabilityId}`,
  DELETE_AVAILABILITIES: availabilityId => `${process.env.REACT_APP_API_URL}availabilities/${availabilityId}`,
};
export default API;