import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from "../auth/UserContext"
import Dropdown from '../components/dropdown';
import Modal from 'react-modal';
import plus from '../assets/images/plus.png';

export default function AddCourse() {
  const { userInfo } = useContext(UserContext);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedTimesRange, setSelectedTimesRange] = useState({'Lu': [], 'Ma': [], 'Mi': [], 'Ju': [], 'Vi': [], 'Sa': [], 'Do': []});
  const [selectedTimes, setSelectedTimes] = useState({'Lu': [], 'Ma': [], 'Mi': [], 'Ju': [], 'Vi': [], 'Sa': [], 'Do': []});
  const daysOfWeekCompleteName = {'Lu': 'Lunes', 'Ma': 'Martes', 'Mi': 'Miércoles', 'Ju': 'Jueves', 'Vi': 'Viernes', 'Sa': 'Sábado', 'Do': 'Domingo'};
  const navigate = useNavigate();
  
  const handleClickDayDropdown = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleClickSaveDate = () => {
    if (selectedDay && selectedTimeRange) {
      const [startTime, endTime] = selectedTimeRange.split(' - ');
      const newTime = { day: selectedDay, startTime: startTime, endTime: endTime };
      const updatedTimes = { ...selectedTimes };
      updatedTimes[selectedDay] = [...updatedTimes[selectedDay], newTime];
      const updatedTimesRange = { ...selectedTimesRange };
      updatedTimesRange[selectedDay] = [...updatedTimesRange[selectedDay], selectedTimeRange];
      setSelectedTimesRange(updatedTimesRange);
      setSelectedTimes(updatedTimes);
      setIsModalOpen(false)
      setSelectedTimeRange(null);
    }
  };

  const handleClickSaveCourse = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    console.log('Curso guardado');
  };

  return (
    <div>

      <div className="bg-white m-10 p-10 drop-shadow-2xl rounded-2xl align-center justify-center">
        <div className="2xl:mx-56 lg:mx-28 sm:mx-12 space-y-5">
          <h1 className="2xl:text-6xl lg:text-6xl sm:text-5xl space-y-4 font-bold drop-shadow-2xl text-slate-900 shadow-black">
            Publica una clase
          </h1>
          <button 
            onClick={handleClickSaveCourse}
            className="absolute top-10 right-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow focus:outline-none focus:shadow-outline"
            style={{ backgroundColor: userInfo ? '#00ABD0' : '#111928'}}
          >
            {userInfo ? 'Guardar' : 'Iniciar sesión'}
          </button>
        </div>
        <div className="flex 2xl:space-x-16 lg:space-x-8 sm:space-x-2 justify-center text-center mt-20 mb-32">
          <div className="w-1/3">
            <div>
              <input 
                type="text" 
                id="courseName" 
                placeholder="Ingrese el nombre del curso"
                value={courseName}
                onChange={(event) => setCourseName(event.target.value)}
                className="rounded-full shadow-md border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 w-full h-12"
                style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
              />
            </div>
            {/* <div className="flex justify-center mt-8 space-x-4"> */}
              <div className="mt-8">
                  <Dropdown 
                    placeholder={"Elegir área"} 
                    options={['Matemáticas', 'Química', 'Física']}
                    onSelect={(selectedOption) => setSelectedArea(selectedOption)} 
                  />
                </div>
                {console.log(selectedArea)}
            {/* </div> */}
            <div className="mt-8">
              <textarea 
                type="textarea" 
                id="courseDescription" 
                placeholder="Agregar descripción del curso"
                value={courseDescription}
                onChange={(event) => setCourseDescription(event.target.value)}
                className="rounded-lg shadow-md border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 w-full h-64"
                style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
              />
              </div>
          </div>
          <div className="w-2/3">
            <div className="grid grid-cols-7 gap-0.5">
              {Object.keys(daysOfWeekCompleteName).map((day, index) => (
                <div key={index} className="bg-white-200 text-center py-4">{day}</div>
              ))}              
              <div className="bg-gray-500 h-1 col-span-7"></div>

              {Object.keys(daysOfWeekCompleteName).map((day, index) => (
                <div key={index} className="bg-white-200 flex flex-col items-center py-4">
                  {selectedTimes[day]
                    .sort((a, b) => {
                      return new Date('1970/01/01 ' + a.startTime) - new Date('1970/01/01 ' + b.startTime);
                    })
                    .map((time, index) => (
                      <div key={index} className="bg-gray-200 text-center py-2 px-4 rounded-full m-1" style={{ width: '130px' }}>
                        {time.startTime} - {time.endTime}
                      </div>
                    ))}
                  <img onClick={() => handleClickDayDropdown(day)} src={plus} alt="Agregar horario" className="w-7 h-7" /> 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Agregar Horario"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            width: '50%',
            height: '50%',
            margin: 'auto',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
          }
        }}
      >
      <div className="p-4">
        <h1 className="text-center 2xl:text-lg:text-4xl sm:text-3xl space-y-4 font-bold drop-shadow-2xl text-slate-900 shadow-black">
          Agregar horario para {daysOfWeekCompleteName[selectedDay]}
        </h1>
        <div className="flex justify-center mt-8">
          <Dropdown 
            placeholder={"Elegir horario"}
            options={['9:00 - 10:30', '10:30 - 12:00', '12:00 - 13:30', '13:30 - 15:00', '15:00 - 16:30', '16:30 - 18:00', '18:00 - 19:30', '19:30 - 21:00']} 
            optionsSelected={selectedTimesRange[selectedDay]}
            onSelect={(selectedOption) => setSelectedTimeRange(selectedOption)}
          />
        </div>
        <p className="mt-20 text-center text-xl text-gray-600">Horario seleccionado: {selectedTimeRange || '...'}</p>
        <button onClick={handleClickSaveDate} className="block mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Aceptar
        </button>
      </div>
      </Modal>
    </div>
  );
}
