export async function sendCreateNewFournisseur(data) {
  const JSONdata = JSON.stringify(data);
  // API endpoint where we send form data.
  const endpoint = "http://127.0.0.1:8000/api/fournisseurs/";

  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: "POST",
    // Tell the server we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata,
  };

  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options);
  return response;
}

export async function get_all_existing_fournisseur_specialties() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/fournisseur_specialties/`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const resData = await response.json();

  return resData.map((obj) => obj.name);
}

export async function get_all_existing_fournisseur_categories() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/fournisseur_categories/`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const resData = await response.json();

  return resData.map((obj) => obj.name);
}
