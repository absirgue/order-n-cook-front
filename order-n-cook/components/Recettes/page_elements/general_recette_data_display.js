import { useState } from "react";
import Select from "react-select";
import SeasonnalityDisplay from "../../Ingredients/Ingredients/page_elements/seasonnality_display";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const GeneralRecetteDataDisplay = ({ recette, is_edit = false }) => {
  const [new_data_inputted, set_new_data_inputted] = useState(false);
  const [genres, setGenres] = useState(
    recette.genres.map((genre) => {
      return { value: 0, label: genre.name };
    })
  );
  const [tastes, setTastes] = useState(
    recette.tastes.map((taste) => {
      return { value: 0, label: taste.name };
    })
  );
  const [category, setCategory] = useState([
    { value: 0, label: recette.category },
  ]);

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

  const all_existing_categories = [
    { name: "entree", id: 1 },
    { name: "plat", id: 2 },
    { name: "dessert", id: 3 },
    { name: "condiment", id: 4 },
  ];
  const category_options = [];

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

  let recette_season_start = null;
  let recette_season_end = null;

  if (recette.season) {
    if (recette.season[0] && recette.season[recette.season.length - 1]) {
      for (let i = 0; i < recette.season.length; i++) {
        if (!recette.season[i]) {
          recette_season_end = MONTHS[i - 1];
          break;
        }
      }
      for (let i = recette.season.length - 1; i >= 0; i = i - 1) {
        if (!recette.season[i]) {
          recette_season_start = MONTHS[i + 1];
          break;
        }
      }
    } else {
      for (let i = 0; i < recette.season.length; i++) {
        if (recette.season[i]) {
          recette_season_start = MONTHS[i];
          break;
        }
      }
      for (let i = recette.season.length - 1; i >= 0; i = i - 1) {
        if (recette.season[i]) {
          recette_season_end = MONTHS[i];
          break;
        }
      }
    }
  }

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
                  <label htmlFor="duration">
                    Temps de cuisson (en minutes):
                  </label>
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
                <div className="d-flex flex-row justify-content-start">
                  <label htmlFor="temperature">Température:</label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    defaultValue={
                      recette.temperature ? recette.temperature : null
                    }
                    onChange={() => set_new_data_inputted(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={
                      recette.temperature ? recette.temperature : 180
                    }
                  ></input>
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <label htmlFor="sous_vide_pression">
                    Sous vide - pression:
                  </label>
                  <input
                    type="number"
                    id="sous_vide_pression"
                    name="sous_vide_pression"
                    defaultValue={
                      recette.sous_vide_pression
                        ? recette.sous_vide_pression
                        : null
                    }
                    onChange={() => set_new_data_inputted(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={
                      recette.sous_vide_pression
                        ? recette.sous_vide_pression
                        : 2
                    }
                  ></input>
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <label htmlFor="sous_vide_soudure">
                    Sous vide - soudure:
                  </label>
                  <input
                    type="number"
                    id="sous_vide_soudure"
                    name="sous_vide_soudure"
                    defaultValue={
                      recette.sous_vide_soudure
                        ? recette.sous_vide_soudure
                        : null
                    }
                    onChange={() => set_new_data_inputted(true)}
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={
                      recette.sous_vide_soudure ? recette.sous_vide_soudure : 1
                    }
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
                <div
                  className={
                    "d-flex flex-row align-items-baseline justify-content-end col-12"
                  }
                >
                  <p>Début de saison:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    name="season_start"
                    defaultValue={
                      recette_season_start ? recette_season_start : null
                    }
                    required
                  >
                    <option disabled>Choisir un mois</option>
                    {MONTHS.map((taste) => (
                      <option value={taste}>{taste}</option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    "d-flex flex-row align-items-baseline justify-content-end col-12"
                  }
                >
                  <p>Fin de saison:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    name="season_end"
                    defaultValue={
                      recette_season_end ? recette_season_end : null
                    }
                    required
                  >
                    <option disabled>Choisir un mois</option>
                    {MONTHS.map((taste) => (
                      <option value={taste}>{taste}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
              <label style={{ marginRight: "7px" }} htmlFor="categories">
                Catégorie:
              </label>
              <Select
                id="categories"
                className="flex-grow-1"
                options={category_options}
                placeholder="Ajouter des étiquettes de goûts à la recette"
                isSearchable={true}
                value={category}
                onChange={(data) => {
                  setCategory(data);
                  set_new_data_inputted(true);
                }}
              />
            </div>
            <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
              <label style={{ marginRight: "7px" }} htmlFor="tastes">
                Goûts:
              </label>
              <Select
                className="flex-grow-1"
                options={taste_options}
                placeholder="Ajouter des goûts à la recette"
                isSearchable={true}
                value={tastes}
                onChange={(data) => {
                  setTastes(data);
                  set_new_data_inputted(true);
                }}
                isMulti
              />
            </div>
            <div className="col-12 d-flex flew-row justify-content-start align-items-baseline mb-2">
              <label style={{ marginRight: "7px" }} htmlFor="tastes">
                Genres:
              </label>
              <Select
                className="flex-grow-1"
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
            </div>

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
        <>
          <div className="d-flex flex-row justify-content-between col-8">
            <div className="d-flex flex-column justify-content-start col-4 align-items-start">
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Quantité:{" "}
                <span style={{ fontSize: "16px" }}>
                  {recette.quantity + " " + recette.unit}
                </span>
              </p>
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Temps de cuisson:{" "}
                <span style={{ fontSize: "16px" }}>{formatted_duration}</span>
              </p>
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Température de cuisson:{" "}
                <span style={{ fontSize: "16px" }}>{recette.temperature}</span>
              </p>
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Sous vide - pression:{" "}
                <span style={{ fontSize: "16px" }}>
                  {recette.sous_vide_pression}
                </span>
              </p>
              <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                Sous vide - soudure:{" "}
                <span style={{ fontSize: "16px" }}>
                  {recette.sous_vide_soudure}
                </span>
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
                Prix de vente TTC (pour {recette.quantity + " " + recette.unit}
                ):{" "}
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
          <div className="col-11 d-flex flex-column justify-content-start mt-3 mb-3">
            {recette.allergenes ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-baseline">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Allergènes:
                </i>
                <p style={{ marginBottom: "0px" }}>{recette.allergenes}</p>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Aucun allergène</i>
            )}
            {recette.season ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Saisonnalité:
                </i>
                <div className="col-5">
                  <SeasonnalityDisplay
                    ingredient_data={recette}
                  ></SeasonnalityDisplay>
                </div>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Saisonnalité non renseignée</i>
            )}
            {recette.genres ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Genres:
                </i>
                <div className="col-5">
                  <p style={{ marginBottom: "0px" }}>{genres_string}</p>
                </div>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Aucun genre renseigné</i>
            )}
            {recette.genres ? (
              <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                <i className="me-2" style={{ marginBottom: "0px" }}>
                  Goûts:
                </i>
                <div className="col-5">
                  <p style={{ marginBottom: "0px" }}>{tastes_string}</p>
                </div>
              </div>
            ) : (
              <i style={{ marginBottom: "0px" }}>Aucun goût renseigné</i>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default GeneralRecetteDataDisplay;
