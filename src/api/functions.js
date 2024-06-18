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
    } else {
      const data = await response.json();
      return data;
    }

  } catch (err) {
    console.error(`Error en la solicitud a ${url}:`, err);
    throw err;
  }
}

export async function post(url, data, msg=null) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Ha ocurrido un error en el envío");
      console.log("Error: ", response.status, response.statusText)
      return { ok: false }
    } else {
      const dataResponse = await response.json();
      if (msg) {
        toast.success(msg);
      }
      return {data: dataResponse, ok: true};
    }
    
  } catch (err) {
    toast.error("Ha ocurrido un error en el envío");
    console.log("Error: ", url, err)
  }
}

export async function put(url, data, msg=null) {
  try {
    console.log(data, url)
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Ha ocurrido un error en el envío");
      console.log("Error: ", response.status, response.statusText)
      return { ok: false }
    } else {
      const dataResponse = await response.json();
      if (msg) {
        toast.success(msg);
      }
      return {data: dataResponse, ok: true};
    }

  } catch (err) {
    toast.error("Ha ocurrido un error en el envío");
    console.log("Error: ", url, err)
  }
}

// Funcion delete
export async function remove(url, msg=null) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      toast.error("Ha ocurrido un error en el envío");
      console.log("Error: ", response.status, response.statusText)
      return { ok: false }
    } else {
      const dataResponse = await response.json();
      if (msg) {
        toast.success(msg);
      }
      return {data: dataResponse, ok: true };
    }

  } catch (err) {
    toast.error("Ha ocurrido un error en el envío");
    console.log("Error: ", url, err)
  }
}