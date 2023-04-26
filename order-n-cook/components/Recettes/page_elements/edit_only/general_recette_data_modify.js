import { MONTHS } from "../../../../utils/general_constants";
import { useState } from "react";
import { Button } from "reactstrap";
import Select from "react-select";
import AddRecetteTagButton from "./add_buttons/add_recette_tag_button";
import {
  get_initial_genre_select_value,
  get_initial_taste_select_value,
  get_recette_season_end_month,
  get_recette_season_start_month,
} from "..//helper_functions/general_recette_data";
import { useSWRConfig } from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const GeneralRecetteDataModify = ({ recette }) => {
  console.log(recette);
  const [new_data_inputted, set_new_data_inputted] = useState(false);
  const [genres, setGenres] = useState(get_initial_genre_select_value(recette));
  const [tastes, setTastes] = useState(get_initial_taste_select_value(recette));
  const [category, setCategory] = useState([
    { value: 0, label: recette.category },
  ]);
  const [unitError, setUnitError] = useState(null);
  const [quantityError, setQuantityError] = useState(null);
  const [temperatureError, setTemperatureError] = useState(null);
  const [sousVidePressionError, setSousVidePressionError] = useState(null);
  const [sousVideSoudureError, setSousVideSoudureError] = useState(null);
  const [durationError, setDurationError] = useState(null);
  const [tvaError, setTvaError] = useState(null);
  const [coeffError, setCoeffError] = useState(null);
  const [seasonStartError, setSeasonStartError] = useState(null);
  const [seasonEndError, setSeasonEndError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [tasteError, setTasteError] = useState(null);
  const [genreError, setGenreError] = useState(null);

  const { mutate } = useSWRConfig();

  async function get_all_existing_recette_genres() {
    const response = await fetch(`http://127.0.0.1:8000/api/recette_genres/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    // Awaiting response.json()
    const resData = await response.json();
    console.log(resData.map((obj) => obj.name));
    // Return response data
    return resData.map((obj) => obj.name);
  }

  async function get_all_existing_recette_tastes() {
    const response = await fetch(`http://127.0.0.1:8000/api/recette_tastes/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    // Awaiting response.json()
    const resData = await response.json();

    // Return response data
    return resData.map((obj) => obj.name);
  }

  async function get_all_existing_recette_categories() {
    const response = await fetch(
      `http://127.0.0.1:8000/api/recette_categories/`,
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
    return resData.map((obj) => obj.name);
  }

  const genre_options = [];

  const taste_options = [];

  const category_options = [];

  const generate_option_list = async () => {
    const all_existing_genres = await get_all_existing_recette_genres();
    all_existing_genres.forEach((genre) =>
      genre_options.push({ value: genre, label: genre })
    );
    const all_existing_recette_tastes = await get_all_existing_recette_tastes();
    all_existing_recette_tastes.forEach((taste) =>
      taste_options.push({ value: taste, label: taste })
    );
    const all_existing_recette_categories =
      await get_all_existing_recette_categories();
    all_existing_recette_categories.forEach((category) =>
      category_options.push({ value: category, label: category })
    );
  };

  generate_option_list();

  function reset_all_errors() {
    setUnitError(null);
    setQuantityError(null);
    setTemperatureError(null);
    setSousVidePressionError(null);
    setSousVideSoudureError(null);
    setDurationError(null);
    setTvaError(null);
    setCoeffError(null);
    setSeasonStartError(null);
    setSeasonEndError(null);
    setCategoryError(null);
    setTasteError(null);
    setGenreError(null);
  }

  const updateRecetteGeneralInformation = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.

    let data = {};
    if (event.target.unit.value && event.target.unit.value != recette.unit) {
      data["unit"] = event.target.unit.value;
    }
    if (
      event.target.quantity.value &&
      event.target.quantity.value != recette.quantity
    ) {
      data["quantity"] = parseInt(event.target.quantity.value);
    }
    if (event.target.tva.value && event.target.tva.value != recette.tva) {
      data["tva"] = parseInt(event.target.tva.value);
    }
    if (
      event.target.temperature.value &&
      event.target.temperature.value != recette.temperature
    ) {
      data["temperature"] = parseInt(event.target.temperature.value);
    }
    if (
      event.target.sous_vide_pression.value &&
      event.target.sous_vide_pression.value != recette.sous_vide_pression
    ) {
      data["sous_vide_pression"] = parseInt(
        event.target.sous_vide_pression.value
      );
    }
    if (
      event.target.sous_vide_soudure.value &&
      event.target.sous_vide_soudure.value != recette.sous_vide_soudure
    ) {
      data["sous_vide_soudure"] = parseInt(
        event.target.sous_vide_soudure.value
      );
    }
    if (
      event.target.coefficient.value &&
      event.target.coefficient.value != recette.coefficient
    ) {
      data["coefficient"] = event.target.coefficient.value;
    }
    if (
      event.target.season_start.value &&
      event.target.season_start.value != recette.season_start
    ) {
      data["season_start"] = event.target.season_start.value;
    }

    if (
      event.target.season_end.value &&
      event.target.season_end.value != recette.season_end
    ) {
      data["season_end"] = event.target.season_end.value;
    }

    if (
      event.target.duration.value &&
      event.target.duration.value != recette.duration
    ) {
      data["duration"] = event.target.duration.value;
    }

    const taste_select_values = tastes.map(
      (taste_representation) => taste_representation.label
    );
    if (recette.tastes.toString() != taste_select_values.toString()) {
      data["tastes"] = taste_select_values;
    }

    const genre_select_values = genres.map(
      (genre_representation) => genre_representation.label
    );
    if (recette.genres.toString() != genre_select_values.toString()) {
      data["genres"] = genre_select_values;
    }

    if (category.label != recette.category) {
      data["category"] = category.label;
    }

    const JSONdata = JSON.stringify(data);

    console.log(JSONdata);

    // API endpoint where we send form data.
    const endpoint = `http://127.0.0.1:8000/api/recettes/${recette.id}/`;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "PUT",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    if (response.status == 200) {
      mutate(`http://127.0.0.1:8000/api/recettes/${recette.id}/`);
      reset_all_errors();
    } else {
      console.log("ERROR");
      console.log(result);
      let error_found = false;
      if (result.hasOwnProperty("unit")) {
        setUnitError(result.unit);
        error_found = true;
      }
      if (result.hasOwnProperty("quantity")) {
        setQuantityError(result.quantity);
        error_found = true;
      }
      if (result.hasOwnProperty("temperature")) {
        setTemperatureError(result.temperature);
        error_found = true;
      }
      if (result.hasOwnProperty("sous_vide_pression")) {
        setSousVidePressionError(result.sous_vide_pression);
        error_found = true;
      }
      if (result.hasOwnProperty("sous_vide_soudure")) {
        setSousVideSoudureError(result.sous_vide_soudure);
        error_found = true;
      }
      if (result.hasOwnProperty("season_start")) {
        setSeasonStartError(result.season_start);
        error_found = true;
      }
      if (result.hasOwnProperty("season_end")) {
        setSeasonEndError(result.season_end);
        error_found = true;
      }
      if (result.hasOwnProperty("tva")) {
        setTvaError(result.tva);
        error_found = true;
      }
      if (result.hasOwnProperty("coefficient")) {
        setCoeffError(result.coefficient);
        error_found = true;
      }
      if (result.hasOwnProperty("duration")) {
        setDurationError(result.duration);
        error_found = true;
      }
      if (result.hasOwnProperty("category")) {
        setCategoryError(result.category);
        error_found = true;
      }
      if (result.hasOwnProperty("genres")) {
        setGenreError(result.genres);
        error_found = true;
      }
      if (result.hasOwnProperty("tastes")) {
        setTasteError(result.tastes);
        error_found = true;
      }
      if (!error_found) {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées ou de réessayer utlérieurement."
        );
        mutate(`http://127.0.0.1:8000/api/recettes/${recette.id}/`);
      }
    }
    set_new_data_inputted(false);
  };
  const recette_season_start_month = get_recette_season_start_month(recette);
  const recette_season_end_month = get_recette_season_end_month(recette);

  return (
    <>
      <form
        className="col-10"
        style={{ fontSize: "14px", marginBottom: "0px" }}
        onSubmit={updateRecetteGeneralInformation}
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
            {unitError || quantityError ? (
              <div>
                {quantityError ? (
                  <p className="form-error">{quantityError}</p>
                ) : null}{" "}
                {unitError ? <p className="form-error">{unitError}</p> : null}
              </div>
            ) : null}

            <div className="d-flex flex-row justify-content-start">
              <label htmlFor="duration">Temps de cuisson (en minutes):</label>
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
            {durationError ? (
              <p className="form-error">{durationError}</p>
            ) : null}
            <div className="d-flex flex-row justify-content-start">
              <label htmlFor="temperature">Température:</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                defaultValue={recette.temperature ? recette.temperature : null}
                onChange={() => set_new_data_inputted(true)}
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "5px",
                  textAlign: "end",
                  width: "100px",
                }}
                placeholder={recette.temperature ? recette.temperature : 180}
              ></input>
            </div>
            {temperatureError ? (
              <p className="form-error">{temperatureError}</p>
            ) : null}
            <div className="d-flex flex-row justify-content-start">
              <label htmlFor="sous_vide_pression">Sous vide - pression:</label>
              <input
                type="number"
                id="sous_vide_pression"
                name="sous_vide_pression"
                defaultValue={
                  recette.sous_vide_pression ? recette.sous_vide_pression : null
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
                  recette.sous_vide_pression ? recette.sous_vide_pression : 2
                }
              ></input>
            </div>

            {sousVidePressionError ? (
              <p className="form-error">{sousVidePressionError}</p>
            ) : null}
            <div className="d-flex flex-row justify-content-start">
              <label htmlFor="sous_vide_soudure">Sous vide - soudure:</label>
              <input
                type="number"
                id="sous_vide_soudure"
                name="sous_vide_soudure"
                defaultValue={
                  recette.sous_vide_soudure ? recette.sous_vide_soudure : null
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
            {sousVideSoudureError ? (
              <p className="form-error">{sousVideSoudureError}</p>
            ) : null}
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
            {tvaError ? <p className="form-error">{tvaError}</p> : null}
            <div className="d-flex flex-row justify-content-start">
              <label htmlFor="coefficient">Coefficient:</label>
              <input
                type="number"
                id="coefficient"
                step="any"
                name="coefficient"
                onChange={() => set_new_data_inputted(true)}
                style={{
                  backgroundColor: "transparent",
                  border: 0,
                  borderBottom: "5px",
                  textAlign: "end",
                  width: "100px",
                }}
                placeholder={recette.coefficient ? recette.coefficient : 3.2}
                defaultValue={recette.coefficient ? recette.coefficient : null}
              ></input>
            </div>
            {coeffError ? <p className="form-error">{coeffError}</p> : null}
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
                  recette_season_start_month ? recette_season_start_month : null
                }
                onChange={(e) => {
                  set_new_data_inputted(true);
                }}
                required
              >
                <option disabled>Choisir un mois</option>
                {MONTHS.map((month) => (
                  <option value={month}>{month}</option>
                ))}
              </select>
            </div>
            {seasonStartError ? (
              <p className="form-error">{seasonStartError}</p>
            ) : null}
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
                  recette_season_end_month ? recette_season_end_month : null
                }
                onChange={(e) => {
                  set_new_data_inputted(true);
                }}
                required
              >
                <option disabled>Choisir un mois</option>
                {MONTHS.map((taste) => (
                  <option value={taste}>{taste}</option>
                ))}
              </select>
            </div>
            {seasonEndError ? (
              <p className="form-error">{seasonEndError}</p>
            ) : null}
          </div>
        </div>
        <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
          <div className="col-12 d-flex flew-row justify-content-between align-items-baseline">
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
          <div className="col-1 d-flex flex-row justify-content-center">
            <AddRecetteTagButton is_category={true}></AddRecetteTagButton>
          </div>
        </div>

        {categoryError ? <p className="form-error">{categoryError}</p> : null}
        <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
          <div className="col-12 d-flex flew-row justify-content-between align-items-baseline">
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
          <div className="col-1 d-flex flex-row justify-content-center">
            <AddRecetteTagButton is_taste={true}></AddRecetteTagButton>
          </div>
        </div>
        {tasteError ? <p className="form-error">{tasteError}</p> : null}
        <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
          <div className="col-12 d-flex flew-row justify-content-between align-items-baseline">
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
          <div className="col-1 d-flex flex-row justify-content-center">
            <AddRecetteTagButton is_genre={true}></AddRecetteTagButton>
          </div>
        </div>
        {genreError ? <p className="form-error">{genreError}</p> : null}

        <div className="col-12 d-flex flex-row justify-content-end mt-2">
          {new_data_inputted ? (
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
          ) : null}
        </div>
      </form>
    </>
  );
};

export default GeneralRecetteDataModify;
