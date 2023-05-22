import Select from "react-select";
import { useState } from "react";
import { Button } from "reactstrap";

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

  const categoryChoices = [
    { name: "crémerie" },
    { name: "boucherie" },
    { name: "maraîcher" },
  ];

  const specialtyChoices = [
    { name: "frommager" },
    { name: "crémier" },
    { name: "charcutier" },
  ];

  const category_options = [];
  const specialty_options = [];
  const generate_option_list = async () => {
    categoryChoices
      .map((obj) => obj.name)
      .forEach((genre) =>
        category_options.push({ value: genre, label: genre })
      );

    specialtyChoices
      .map((obj) => obj.name)
      .forEach((taste) =>
        specialty_options.push({ value: taste, label: taste })
      );
  };
  generate_option_list();

  return (
    <div className="col-12 d-flex flex-column justify-content-center mb-3">
      <div className="col-12 d-flex flex-row justify-content-between">
        {" "}
        <div className="col-5 d-flex flew-row justify-content-between align-items-baseline">
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
        <div className="col-5 d-flex flew-row justify-content-between align-items-baseline">
          <label style={{ marginRight: "7px" }} htmlFor="categories">
            Sous catégorie:
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
            defaultValue={
              fournisseur.last_time_order ? fournisseur.last_time_order : null
            }
            onChange={() => set_new_data_inputted(true)}
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
        <div className="col-12 d-flex flex-row justify-content-end">
          <Button className="btn-primary">Enregistrer</Button>
        </div>
      ) : null}
    </div>
  );
}
