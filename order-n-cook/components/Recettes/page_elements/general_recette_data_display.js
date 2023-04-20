import { useState } from "react";
import Select from "react-select";
const GeneralRecetteDataDisplay = ({ recette, is_edit = false }) => {
  const [new_data_inputted, set_new_data_inputted] = useState(false);
  const [genres, setGenres] = useState([{ value: 0, label: "genre de base" }]);
  const [tastes, setTastes] = useState([{ value: 0, label: "taste de base" }]);

  var tastes_string = "";
  if (recette.tastes.length > 0) {
    recette.tastes.forEach((taste) => (tastes_string += taste.name + "; "));
    tastes_string = tastes_string.substring(0, tastes_string.length - 2);
  }
  var genres_string = "";
  if (recette.genres.length > 0) {
    recette.genres.forEach((taste) => (genres_string += taste.name + "; "));
    genres_string = genres_string.substring(0, genres_string.length - 2);
  }
  var formatted_duration = recette.duration + "min.";
  if (recette.duration > 60) {
    formatted_duration =
      (recette.duration - (recette.duration % 60)) / 60 +
      "h. " +
      (recette.duration % 60) +
      "min.";
  }

  const all_existing_genres = [
    { name: "français", id: 1 },
    { name: "mijoté", id: 2 },
    { name: "genre 3", id: 3 },
    { name: "genre 4", id: 4 },
    { name: "genre 5", id: 5 },
  ];
  const genre_options = [];

  const all_existing_tastes = [
    { name: "taste 1", id: 1 },
    { name: "taste 2", id: 2 },
    { name: "taste 3", id: 3 },
    { name: "taste 4", id: 4 },
    { name: "taste 5", id: 5 },
  ];
  const taste_options = [];

  const generate_option_list = () => {
    all_existing_genres.forEach((genre) =>
      genre_options.push({ value: genre.id, label: genre.name })
    );
    all_existing_tastes.forEach((taste) =>
      taste_options.push({ value: taste.id, label: taste.name })
    );
  };
  generate_option_list();

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (event.target.unit.value) {
      data["unit"] = event.target.unit.value;
    }
    if (event.target.quantity.value) {
      data["quantity"] = event.target.quantity.value;
    }
    if (event.target.tva.value) {
      data["tva"] = event.target.tva.value;
    }
    if (event.target.coefficient.value) {
      data["coefficient"] = event.target.coefficient.value;
    }
    if (event.target.duration.value) {
      data["duration"] = event.target.coefficient.value;
    }

    tastes.forEach((taste) => {
      if (taste.value != 0) {
        // Create new taste for recipe
        console.log(taste.label);
      }
    });

    genres.forEach((genre) => {
      if (genre.value != 0) {
        // Create new genre for recipe
        console.log(genre.label);
      }
    });

    const JSONdata = JSON.stringify(data);
    console.log(JSONdata);

    // API endpoint where we send form data.
    // const endpoint = "/api/form";

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
    // const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    // const result = await response.json();
    alert(`Data: ${JSONdata}`);
  };

  return (
    <>
      {is_edit ? (
        <>
          <form
            className="col-10"
            style={{ fontSize: "14px", marginBottom: "0px" }}
            onSubmit={handleSubmit}
          >
            <div className="d-flex flex-row justify-content-between ">
              <div className="d-flex flex-column justify-content-start col-6 align-items-start">
                <div className="d-flex flex-row justify-content-start">
                  <label htmlFor="quantity">Quantité:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={recette.quantity ? recette.quantity : 1}
                    onChange={() => set_new_data_inputted(true)}
                    defaultValue={recette.quantity ? recette.quantity : null}
                  ></input>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    placeholder={recette.unit ? recette.unit : "kilogramme"}
                    defaultValue={recette.unit ? recette.unit : null}
                    onChange={() => set_new_data_inputted(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: 1,
                      width: "100%",
                    }}
                  ></input>
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <label htmlFor="duration">Durée (en minutes):</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    defaultValue={recette.duration ? recette.duration : null}
                    onChange={() => set_new_data_inputted(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={recette.duration ? recette.duration : 35}
                  ></input>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-start col-6 align-items-end">
                <div className="d-flex flex-row justify-content-start">
                  <label htmlFor="tva">Taux de TVA:</label>
                  <input
                    type="number"
                    id="tva"
                    name="tva"
                    onChange={() => set_new_data_inputted(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={recette.tva ? recette.tva : "10"}
                    defaultValue={recette.tva ? recette.tva : null}
                  ></input>
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <label htmlFor="coefficient">Coefficient:</label>
                  <input
                    type="number"
                    id="coefficient"
                    name="coefficient"
                    onChange={() => set_new_data_inputted(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={
                      recette.coefficient ? recette.coefficient : 3.2
                    }
                    defaultValue={
                      recette.coefficient ? recette.coefficient : null
                    }
                  ></input>
                </div>
              </div>
            </div>

            <Select
              className="col-12 mb-2"
              options={genre_options}
              placeholder="Ajouter des genres à la recette"
              isSearchable={true}
              value={genres}
              onChange={(data) => {
                setGenres(data);
                set_new_data_inputted(true);
              }}
              isMulti
            />
            <Select
              className="col-12 mb-2"
              options={taste_options}
              placeholder="Ajouter des étiquettes de goûts à la recette"
              isSearchable={true}
              value={tastes}
              onChange={(data) => {
                setTastes(data);
                set_new_data_inputted(true);
              }}
              isMulti
            />
            <div className="col-12 d-flex flex-row justify-content-end mt-2">
              {new_data_inputted ? (
                <button className="btn btn-primary" type="submit">
                  Enregistrer
                </button>
              ) : null}
            </div>
          </form>
        </>
      ) : (
        <div className="d-flex flex-row justify-content-between col-8">
          <div className="d-flex flex-column justify-content-start col-4 align-items-start">
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Quantité:{" "}
              <span style={{ fontSize: "16px" }}>
                {recette.quantity + " " + recette.unit}
              </span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Durée:{" "}
              <span style={{ fontSize: "16px" }}>{formatted_duration}</span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Catégorie:{" "}
              <span style={{ fontSize: "16px" }}>{recette.category}</span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              {recette.tastes.length > 1 ? "Goûts:" : "Goût:"}{" "}
              <span style={{ fontSize: "16px" }}>{tastes_string}</span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              {recette.tastes.length > 1 ? "Genres:" : "Genre:"}{" "}
              <span style={{ fontSize: "16px" }}>{genres_string}</span>
            </p>
          </div>
          <div className="d-flex flex-column justify-content-start col-6 align-items-end">
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Prix de revient:{" "}
              <span style={{ fontSize: "16px" }}>
                {recette.ingredients_cost + "€"}
              </span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Taux de TVA:{" "}
              <span style={{ fontSize: "16px" }}>{recette.tva + "%"}</span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Coefficient:{" "}
              <span style={{ fontSize: "16px" }}>{recette.coefficient}</span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Prix de vente HT (pour {recette.quantity + " " + recette.unit}
              ):{" "}
              <span style={{ fontSize: "16px" }}>
                {recette.selling_price_ht + "€"}
              </span>
            </p>
            <p style={{ fontSize: "14px", marginBottom: "0px" }}>
              Prix de vente TTC (pour {recette.quantity + " " + recette.unit}):{" "}
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                {recette.selling_price_ttc + "€"}
              </span>
            </p>
            {recette.unit_selling_price_ttc ? (
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Prix de vente unitaire TTC:{" "}
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  {recette.unit_selling_price_ttc + "€"}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};
export default GeneralRecetteDataDisplay;
