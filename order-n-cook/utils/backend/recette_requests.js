export async function sendCreateNewRecette(data) {
  const JSONdata = JSON.stringify(data);
  // API endpoint where we send form data.
  const endpoint = "http://127.0.0.1:8000/api/general/recettes/";

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
