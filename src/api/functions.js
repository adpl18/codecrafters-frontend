import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function get(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error en la solicitud a ${url}:`, err);
    throw err;
  }
}

export async function post(url, data) {
  try {
    console.log("URL: ", url)
    console.log("DATA: ", data)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Ha ocurrido un error en el evnvío");
      console.log("Error: ", response.status, response.statusText)
    }

    
    const dataResponse = await response.json();
    toast.success("Horario agregado con éxito");
    return dataResponse;
  } catch (err) {
    toast.error("Ha ocurrido un error en el evnvío");
    console.log("Error: ", url, err)
  }
}