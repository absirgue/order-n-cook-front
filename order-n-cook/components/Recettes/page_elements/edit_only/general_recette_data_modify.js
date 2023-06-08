import { MONTHS } from "../../../../utils/general_constants";
import { useState } from "react";
import Select from "react-select";
import AddRecetteTagButton from "./add_buttons/add_recette_tag_button";
import {
  get_initial_genre_select_value,
  get_initial_taste_select_value,
  get_recette_season_end_month,
  get_recette_season_start_month,
  get_data_object_for_recette_general_info_update_event,
} from "..//helper_functions/general_recette_data";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

async function sendUpdateRecetteRequest(data, recette) {
  const JSONdata = JSON.stringify(data);

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
  return response;
}

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

  const { data: genreData, error: genreDataError } = useSWR(
    `http://127.0.0.1:8000/api/recette_genres/`,
    fetcher
  );
  const { data: tasteData, error: tasteDataError } = useSWR(
    `http://127.0.0.1:8000/api/recette_tastes/`,
    fetcher
  );
  const { data: categoryData, error: categoryDataError } = useSWR(
    `http://127.0.0.1:8000/api/recette_categories/`,
    fetcher
  );

  const genre_options = [];

  const taste_options = [];

  const category_options = [];

  const generate_option_list = async () => {
    genreData
      .map((obj) => obj.name)
      .forEach((genre) => genre_options.push({ value: genre, label: genre }));

    tasteData
      .map((obj) => obj.name)
      .forEach((taste) => taste_options.push({ value: taste, label: taste }));

    categoryData
      .map((obj) => obj.name)
      .forEach((category) =>
        category_options.push({ value: category, label: category })
      );
  };

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
    const data = get_data_object_for_recette_general_info_update_event(
      event,
      recette,
      genres,
      tastes,
      category
    );

    const response = await sendUpdateRecetteRequest(data, recette);
    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.

    if (response.status == 200) {
      mutate(`http://127.0.0.1:8000/api/recettes/${recette.id}/`);
      reset_all_errors();
    } else {
      const result = await response.json();
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

  if (genreDataError || tasteDataError || categoryDataError) {
    return (
      <div>
        Une erreur est survenue lors du chargement de la page. Si cette erreur
        persiste, contactez le service technique.
      </div>
    );
  }

  if (!(genreData && tasteData && categoryData))
    return <div>Chargement en cours ...</div>;
  generate_option_list();
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
              placeholder="Sélectionner une catégorie pour cette recette"
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
