export async function get_all_existing_ingredient_categories_request() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/ingredient_categories/`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const resData = await response.json();
  return resData;
}

export async function get_all_existing_ingredient_sous_categories_request() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/ingredient_sous_categories/`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  const resData = await response.json();
  return resData;
}

export async function create_new_unit_conversion(data) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = "http://127.0.0.1:8000/api/conversion_rate/";

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
