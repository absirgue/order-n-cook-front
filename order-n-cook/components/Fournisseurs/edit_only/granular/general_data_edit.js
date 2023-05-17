import Select from "react-select";
import { useState } from "react";

export default function EditFournisseurGeneralData({ fournisseur }) {
  const [category, setCategory] = useState([
    { value: 0, label: fournisseur.category },
  ]);
  const [specialty, setSpecialty] = useState([
    { value: 0, label: fournisseur.specialty },
  ]);

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
    <div className="col-12 d-flex flex-column justify-content-center">
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
      <div className="col-12 d-flex flex-row justify-content-between">
        <div className="col-6 me-1">
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
        </div>
        <div className="col-6 ms-1"></div>
      </div>
    </div>
  );
}
