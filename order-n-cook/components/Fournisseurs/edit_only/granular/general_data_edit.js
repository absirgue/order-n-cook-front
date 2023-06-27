import Select from "react-select";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { get_data_object_for_fournisseur_general_info_update_event } from "../../helpers/general_fournisseur";
import { Button } from "reactstrap";

const fetcher = (url) => fetch(url).then((res) => res.json());

async function sendUpdateFournisseurData(data, fournisseur) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = `http://127.0.0.1:8000/api/fournisseurs/${fournisseur.id}/`;

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

export default function EditFournisseurGeneralData({ fournisseur }) {
  const [category, setCategory] = useState([
    { value: 0, label: fournisseur.category },
  ]);
  const [specialty, setSpecialty] = useState([
    { value: 0, label: fournisseur.specialty },
  ]);
  const [newData, set_new_data_inputted] = useState(false);
  const [deliversMonday, setDeliversMonday] = useState(
    fournisseur.delivers_monday
  );
  const [deliversTuesday, setDeliversTuesday] = useState(
    fournisseur.delivers_tuesday
  );
  const [deliversWednesday, setDeliversWednesday] = useState(
    fournisseur.delivers_wednesday
  );
  const [deliversThursday, setDeliversThursday] = useState(
    fournisseur.delivers_thursday
  );
  const [deliversFriday, setDeliversFriday] = useState(
    fournisseur.delivers_friday
  );
  const [deliversSaturday, setDeliversSaturday] = useState(
    fournisseur.delivers_saturday
  );
  const [deliversSunday, setDeliversSunday] = useState(
    fournisseur.delivers_sunday
  );
  const { mutate } = useSWRConfig();

  const [lastOrderTime, setLastOrderTime] = useState(
    fournisseur.last_order_time
  );
  const [categoryError, setCategoryError] = useState(null);
  const [specialtyError, setSpecialtyError] = useState(null);
  const [deliveryError, setDeliveryError] = useState(null);
  const [lastOrderTimeError, setLastOrderTimeError] = useState(null);

  const { data: categoryChoices, error: categoryDataError } = useSWR(
    `http://127.0.0.1:8000/api/fournisseur_categories/`,
    fetcher
  );
  const { data: specialtyChoices, error: specialtyDataError } = useSWR(
    `http://127.0.0.1:8000/api/fournisseur_specialties/`,
    fetcher
  );

  function reset_all_errors() {
    setCategoryError(null);
    setSpecialtyError(null);
    setDeliveryError(null);
    setLastOrderTimeError(null);
  }

  const updateFournisseurGeneralInformation = async () => {
    // Stop the form from submitting and refreshing the page.
    const data = get_data_object_for_fournisseur_general_info_update_event(
      lastOrderTime,
      fournisseur,
      category,
      deliversMonday,
      deliversTuesday,
      deliversWednesday,
      deliversThursday,
      deliversFriday,
      deliversSaturday,
      deliversSunday,
      specialty
    );

    const response = await sendUpdateFournisseurData(data, fournisseur);
    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.

    if (response.status == 200) {
      mutate(`http://127.0.0.1:8000/api/fournisseurs/${fournisseur.id}/`);
      reset_all_errors();
    } else {
      const result = await response.json();
      let error_found = false;
      if (result.hasOwnProperty("category")) {
        setCategoryError(result.category);
        error_found = true;
      }
      if (result.hasOwnProperty("specialty")) {
        setSpecialtyError(result.specialty);
        error_found = true;
      }
      if (
        result.hasOwnProperty("delivers_monday") &&
        result.hasOwnProperty("delivers_tuesday") &&
        result.hasOwnProperty("delivers_wednesday") &&
        result.hasOwnProperty("delivers_thursday") &&
        result.hasOwnProperty("delivers_friday") &&
        result.hasOwnProperty("delivers_saturday") &&
        result.hasOwnProperty("delivers_sunday")
      ) {
        setDeliveryError("Une erreur est survenue avec l'un de ces champs");
        error_found = true;
      }
      if (result.hasOwnProperty("last_order_time")) {
        setLastOrderTimeError(result.last_order_time);
        error_found = true;
      }
      if (!error_found) {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées ou de réessayer utlérieurement."
        );
        mutate(`http://127.0.0.1:8000/api/fournisseurs/${fournisseur.id}/`);
      }
    }
    set_new_data_inputted(false);
  };

  const category_options = [];
  const specialty_options = [];
  const generate_option_list = async () => {
    categoryChoices
      ?.map((obj) => obj.name)
      .forEach((category) =>
        category_options.push({ value: category, label: category })
      );

    specialtyChoices
      ?.map((obj) => obj.name)
      .forEach((specialty) =>
        specialty_options.push({ value: specialty, label: specialty })
      );
  };

  if (categoryDataError || specialtyDataError) {
    return (
      <div>
        Une erreur est survenue lors du chargement de la page. Si cette erreur
        persiste, contactez le service technique.
      </div>
    );
  }

  if (!(categoryChoices && specialtyChoices))
    return <div>Chargement en cours ...</div>;
  generate_option_list();

  return (
    <div className="col-12 d-flex flex-column justify-content-center mb-3">
      <div className="col-12 d-flex flex-row justify-content-between">
        {" "}
        <div className="col-5 d-flex flex-column align-items-end">
          <div className="col-12 d-flex flew-row justify-content-between align-items-baseline">
            <label style={{ marginRight: "7px" }} htmlFor="categories">
              Catégorie:
            </label>
            <Select
              id="categories"
              className="flex-grow-1"
              options={category_options}
              placeholder="Sélectionner une catégorie pour ce fournisseur"
              isSearchable={true}
              value={category}
              onChange={(data) => {
                setCategory(data);
                set_new_data_inputted(true);
              }}
            />
          </div>
          {categoryError ? (
            <p style={{ color: "red" }}>{categoryError}</p>
          ) : null}
        </div>
        <div className="col-5 d-flex flex-column align-items-end">
          <div className="col-12 d-flex flew-row justify-content-between align-items-baseline">
            <label style={{ marginRight: "7px" }} htmlFor="categories">
              Spécialité métier:
            </label>
            <Select
              id="categories"
              className="flex-grow-1"
              options={specialty_options}
              placeholder="Sélectionner une spécialité pour ce fournisseur"
              isSearchable={true}
              value={specialty}
              onChange={(data) => {
                setSpecialty(data);
                set_new_data_inputted(true);
              }}
            />
          </div>
          {specialtyError ? (
            <p style={{ color: "red" }}>{lastOrderTimeError}</p>
          ) : null}
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center">
        <p className="p-1" style={{ fontStyle: "italic" }}>
          Jours de livraison:
        </p>
        <div className={"d-flex flex-row align-items-center ms-2"}>
          {deliversMonday ? (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversMonday(false);
                set_new_data_inputted(true);
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversMonday(true);
                set_new_data_inputted(true);
              }}
            />
          )}
          <p style={{ fontSize: 16, marginLeft: "5px" }}>Lundi</p>
        </div>
        <div className={"d-flex flex-row align-items-center ms-2"}>
          {deliversTuesday ? (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversTuesday(false);
                set_new_data_inputted(true);
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversTuesday(true);
                set_new_data_inputted(true);
              }}
            />
          )}
          <p style={{ fontSize: 16, marginLeft: "5px" }}>Mardi</p>
        </div>
        <div className={"d-flex flex-row align-items-center ms-2"}>
          {deliversWednesday ? (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversWednesday(false);
                set_new_data_inputted(true);
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversWednesday(true);
                set_new_data_inputted(true);
              }}
            />
          )}
          <p style={{ fontSize: 16, marginLeft: "5px" }}>Mercredi</p>
        </div>
        <div className={"d-flex flex-row align-items-center ms-2"}>
          {deliversThursday ? (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversThursday(false);
                set_new_data_inputted(true);
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversThursday(true);
                set_new_data_inputted(true);
              }}
            />
          )}
          <p style={{ fontSize: 16, marginLeft: "5px" }}>Jeudi</p>
        </div>
        <div className={"d-flex flex-row align-items-center ms-2"}>
          {deliversFriday ? (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversFriday(false);
                set_new_data_inputted(true);
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversFriday(true);
                set_new_data_inputted(true);
              }}
            />
          )}
          <p style={{ fontSize: 16, marginLeft: "5px" }}>Vendredi</p>
        </div>
        <div className={"d-flex flex-row align-items-center ms-2"}>
          {deliversSaturday ? (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversSaturday(false);
                set_new_data_inputted(true);
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversSaturday(true);
                set_new_data_inputted(true);
              }}
            />
          )}
          <p style={{ fontSize: 16, marginLeft: "5px" }}>Samedi</p>
        </div>
        <div className={"d-flex flex-row align-items-center ms-2"}>
          {deliversSunday ? (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversSunday(false);
                set_new_data_inputted(true);
              }}
              checked
            />
          ) : (
            <input
              type="checkbox"
              id="example_checkbox"
              onChange={(event) => {
                setDeliversSunday(true);
                set_new_data_inputted(true);
              }}
            />
          )}
          <p style={{ fontSize: 16, marginLeft: "5px" }}>Dimanche</p>
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-end">
        <div className="d-flex flex-row justify-content-start">
          <label htmlFor="last_time_order">Dernière heure de commande:</label>
          <input
            type="text"
            id="last_time_order"
            name="last_time_order"
            defaultValue={lastOrderTime}
            onChange={(event) => {
              set_new_data_inputted(true);
              setLastOrderTime(event.target.value);
            }}
            style={{
              backgroundColor: "transparent",
              border: 0,
              borderBottom: "5px",
              textAlign: "start",
              marginLeft: "5px",
              width: "100px",
            }}
            placeholder={
              fournisseur.last_time_order
                ? fournisseur.last_time_order
                : "16h30"
            }
          ></input>
        </div>
      </div>
      {newData ? (
        <div className="col-12 d-flex flex-row justify-content-end mt-2">
          <Button
            className="btn btn-primary"
            onClick={() => updateFournisseurGeneralInformation()}
          >
            Enregistrer
          </Button>
        </div>
      ) : null}
    </div>
  );
}
