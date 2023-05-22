export async function get_all_existing_ingredients_options() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/general/all_ingredient_and_units/`,
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

export async function create_ingredient_request(data) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = "http://127.0.0.1:8000/api/general/ingredients/";

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
