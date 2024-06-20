export const API = {
  // Endpoints para cursos
  GET_COURSES: () => `${process.env.REACT_APP_API_URL}courses`,
  GET_COURSE: courseId => `${process.env.REACT_APP_API_URL}courses/${courseId}`,
  GET_COURSES_USER: userId => `${process.env.REACT_APP_API_URL}courses/teacher/${userId}`,
  POST_COURSE: () => `${process.env.REACT_APP_API_URL}courses`,

  // Endpoints para usuarios
  GET_USER: userId => `${process.env.REACT_APP_API_URL}users/${userId}`,
  GET_USER_EMAIL: userEmail => `${process.env.REACT_APP_API_URL}users/email/${userEmail}`,
  POST_USER: () => `${process.env.REACT_APP_API_URL}users/`,
  DELETE_USER: userId => `${process.env.REACT_APP_API_URL}users/${userId}`,
  PUT_USER: userId => `${process.env.REACT_APP_API_URL}users/${userId}`,

  // Endpoints para horarios de disponibilidad
  GET_AVAILABILITIES: () => `${process.env.REACT_APP_API_URL}availabilities/`,
  POST_AVAILABILITIES: () => `${process.env.REACT_APP_API_URL}availabilities/`,
  GET_AVAILABILITIES_USER: userId => `${process.env.REACT_APP_API_URL}availabilities/user/${userId}`,
  PUT_AVAILABILITIES: availabilityId => `${process.env.REACT_APP_API_URL}availabilities/${availabilityId}`,
  DELETE_AVAILABILITIES: availabilityId => `${process.env.REACT_APP_API_URL}availabilities/${availabilityId}`,
  PUT_UPDATE_AVAILABILITIES: availabilityId => `${process.env.REACT_APP_API_URL}availabilities/update-status/${availabilityId}`,

  // Endpoints para reservas
  POST_RESERVATION: () => `${process.env.REACT_APP_API_URL}reservations/`,
};
export default API;