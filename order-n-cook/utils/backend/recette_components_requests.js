export async function get_all_existing_recette_categories() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/recette_categories/`,
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

export async function create_new_recette_ingredient(data) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = "http://127.0.0.1:8000/api/recette_ingredients/";

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

export async function create_progression_element_request(data) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = `http://127.0.0.1:8000/api/recette_progression/`;

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

export async function create_recette_section(data) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = `http://127.0.0.1:8000/api/recette_section/`;

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

export async function get_all_possible_sous_recette(recette_id) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/sous_recette_options/${recette_id}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  // Awaiting response.json()
  const resData = await response.json();

  // Return response data
  return resData;
}

export async function create_sous_recette(data) {
  console.log("IN THE DATA SENDING");
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = "http://127.0.0.1:8000/api/sous_recette/";

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
