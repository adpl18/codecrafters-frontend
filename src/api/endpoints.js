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
  GET_RESERVATIONS: () => `${process.env.REACT_APP_API_URL}reservations/`,
  POST_RESERVATION: () => `${process.env.REACT_APP_API_URL}reservations/`,
  PUT_RESERVATION_CANCEL: reservationId => `${process.env.REACT_APP_API_URL}reservations/cancel/${reservationId}`,
  GET_RESERVATION_COURSE: courseId => `${process.env.REACT_APP_API_URL}reservations/course/${courseId}`,
  GET_RESERVATION_USER: userId => `${process.env.REACT_APP_API_URL}reservations/user/${userId}`,
};
export default API;