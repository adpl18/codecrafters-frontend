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
    console.log(response);

    // const data = await response.json();
    // return data;
  } catch (err) {
    console.error(`Error en la solicitud a ${url}:`, err);
    throw err;
  }
}