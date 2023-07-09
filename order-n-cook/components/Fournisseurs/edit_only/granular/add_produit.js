import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";

import { useState } from "react";
import Select from "react-select";
import { create_new_produit } from "../../../../utils/backend/fournisseur_components_requests";
import {
  get_all_existing_ingredient_sous_categories_request,
  get_all_existing_ingredient_categories_request,
} from "../../../../utils/backend/ingredient_components_requests";
import { get_all_existing_ingredients_options_with_labels } from "../../../../utils/backend/ingredient_requests";
import { get_all_existing_labels } from "../../../../utils/backend/ingredient_requests";
import { useSWRConfig } from "swr";
import { create_new_unit_conversion } from "../../../../utils/backend/ingredient_components_requests";
import { create_ingredient_request } from "../../../../utils/backend/ingredient_requests";

export default function AddProduit({ fournisseur_id }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [createNewIngredient, setCreateNewIngredient] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("default");
  const [error, setError] = useState({});
  const [category, setCategory] = useState(null);
  const [sousCategory, setSousCategory] = useState(null);
  const [createNewUnit, setCreateNewUnit] = useState(false);
  const [labels, setLabels] = useState([]);
  const { mutate } = useSWRConfig();

  const category_options = [];

  const sous_category_options = [];

  let ingredient_options = [];

  const label_options = [];

  // Returns all the existing categories for ingredients in a clean way (names only).
  async function get_all_existing_categories() {
    const all_ingredient_categories =
      await get_all_existing_ingredient_categories_request();
    return all_ingredient_categories.map((obj) => obj.name);
  }

  // Returns all the existing sous categories for ingredients in a clean way (names only).
  async function get_all_existing_sous_categories() {
    const all_ingredient_sous_categories =
      await get_all_existing_ingredient_sous_categories_request();
    return all_ingredient_sous_categories.map((obj) => obj.name);
  }

  // Expands on the lists of ingredient options, sous_categories options and categories options to generate
  // option list for the various Select components on the page.
  const generate_option_list = async () => {
    const helper = await get_all_existing_ingredients_options_with_labels();
    helper.forEach((ingredient) =>
      ingredient_options.push({
        value: ingredient.id,
        label: ingredient.name,
        units: ingredient.units,
        labels: ingredient.labels,
      })
    );
    const all_existing_categories = await get_all_existing_categories();
    all_existing_categories.forEach((category) =>
      category_options.push({ value: category, label: category })
    );
    const all_existing_sous_categories =
      await get_all_existing_sous_categories();
    all_existing_sous_categories.forEach((sous_category) =>
      sous_category_options.push({ value: sous_category, label: sous_category })
    );

    const labelData = await get_all_existing_labels();
    labelData.forEach((label) =>
      label_options.push({ value: label.id, label: label.name })
    );
  };

  // Reset all the selections made on the page.
  const resetSelections = () => {
    setSelectedIngredient("");
    setSelectedUnit("default");
    setCreateNewIngredient(false);
    setCategory(null);
    setCreateNewIngredient(false);
    setCreateNewUnit(false);
    setSousCategory(null);
  };

  generate_option_list();

  // Handle page behavior when a new ingredient is created.
  async function handle_ingredient_creation(event_target) {
    let ingredient_creation_data = {};
    if (event_target.ingredient_name.value) {
      ingredient_creation_data["name"] = event_target.ingredient_name.value;
    }
    if (category) {
      ingredient_creation_data["category"] = category.value;
    } else {
      setError({
        ...error,
        category:
          "Veuillez renseigner une catégorie pour ce nouvel ingrédient.",
      });

      return null;
    }
    if (sousCategory) {
      ingredient_creation_data["sous_category"] = sousCategory.value;
    } else {
      setError({
        ...error,
        sousCategory:
          "Veuillez renseigner une sous catégorie pour ce nouvel ingrédient.",
      });

      return null;
    }
    const response = await create_ingredient_request(ingredient_creation_data);
    if (response.status == 201) {
      const result = await response.json();
      return result.id;
    } else if (response.status == 406) {
      alert(
        "L'ingrédient " +
          ingredient_creation_data["name"] +
          " existe déjà. Vous pouvez le trouver dans la liste d'ingrédient."
      );
      return null;
    } else {
      alert("Une erreur est survenue lors de la création de l'ingrédient.");
      return null;
    }
  }

  // Handle page behavior when a new unit is created.
  async function handle_unit_creation(data, event_target) {
    let create_unit_data = {};
    if (event_target.new_unit_name.value) {
      create_unit_data["unit"] = event_target.new_unit_name.value;
    }
    if (event_target.new_unit_conversion.value) {
      create_unit_data["conversion_to_kilo"] =
        event_target.new_unit_conversion.value;
    }
    if (data["ingredient"]) {
      create_unit_data["ingredient"] = data["ingredient"];
    } else {
      return null;
    }

    const response = await create_new_unit_conversion(create_unit_data);
    if (response.status == 201) {
      const result = await response.json();
      return result.unit;
    }
    // MAKE INTO DIFF FUNCTION THAT RETURNS A BOOLEAN
    else if (response.status == 406) {
      alert(
        "L'unité " +
          create_unit_data["unit"] +
          " existe déjà pour cet ingrédient"
      );
      return null;
    } else {
      alert("Une erreur est survenue lors de la création de l'unité.");
      return null;
    }
  }

  // Combine all the elements of the form in a neat data object to create our new recette ingredient.
  // This includes the cases of when an ingredient or a unity is created.
  async function assembleDataObject(event_target) {
    let data = {};
    if (createNewIngredient) {
      data["ingredient"] = await handle_ingredient_creation(event_target);
    } else if (selectedIngredient) {
      data["ingredient"] = selectedIngredient.value;
    } else {
      setError({
        ...error,
        ingredient: "Veuillez sélectionner un ingrédient.",
      });
    }
    if (createNewUnit) {
      data["unit"] = await handle_unit_creation(data, event_target);
    } else if (event_target.unit) {
      if (event_target.unit.value === "default") {
        setError({
          ...error,
          unit: "Veuillez sélectionner un ingrédient.",
        });
      } else {
        data["unit"] = event_target.unit.value;
      }
    } else {
      return null;
    }
    if (event_target.quantity.value && event_target.quantity) {
      data["quantity"] = event_target.quantity.value;
    }
    if (
      event_target.geographic_location &&
      event_target.geographic_location.value
    ) {
      data["geographic_location"] = event_target.geographic_location.value;
    }

    if (event_target.price && event_target.price.value) {
      data["price"] = event_target.price.value;
    }
    data["fournisseur"] = fournisseur_id;

    if (labels) {
      data["labels"] = labels.map((label) => label.value);
    }

    if (
      data["ingredient"] != null &&
      data["unit"] != null &&
      data["price"] != null
    ) {
      return data;
    } else {
      return null;
    }
  }

  /** Handles behavior on a successful RecetteIngredient creation request.
   * This consists in:
   *      - reloading the Recette data
   *      - reseting all errors and selections
   *      - closing the modal
   */
  function handleSuccess() {
    mutate(`http://127.0.0.1:8000/api/fournisseurs/${fournisseur_id}/`);
    setError({});
    resetSelections();
    setModalOpen(!modalOpen);
  }

  /** Handles behavior on a successful RecetteIngredient creation request.
   * This consists in:
   *      - setting the field specific errors to show to the user
   *      - OR (if no specific error is detected) showing an alert dialog
   */
  function handleError(result) {
    if (
      result.hasOwnProperty("quantity") ||
      result.hasOwnProperty("unit") ||
      result.hasOwnProperty("ingredient") ||
      result.hasOwnProperty("labels") ||
      result.hasOwnProperty("geographic_location")
    ) {
      setError(result);
    } else {
      alert(
        "Une erreur est survenue. Merci de vérifier les valeurs renseignées et de réessayer ultérieurement."
      );
    }
  }

  // Handles the submitting of a form by coordinating the various behaviors needed.
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const assembledData = await assembleDataObject(event.target);
    if (assembledData) {
      const response = await create_new_produit(assembledData);
      if (response.status == 201) {
        handleSuccess();
      } else {
        const result = await response.json();
        handleError(result);
      }
    }
  };

  return (
    <>
      <Button className="btn-primary" onClick={() => setModalOpen(true)}>
        Ajouter un produit
      </Button>
      <Modal
        size="lg"
        show={modalOpen}
        onHide={() => setModalOpen(!modalOpen)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <div className="modal-header">
          <h5 className="modal-title">
            {createNewIngredient
              ? "Créer un nouveau produit et l'ajouter à ce fournisseur"
              : "Ajouter un produit à ce fournisseur"}
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => {
              setModalOpen(!modalOpen);
              resetSelections();
            }}
            style={{ backgroundColor: "transparent", border: 0 }}
          >
            x
          </button>
        </div>
        <form
          style={{ fontSize: "14px", marginBottom: "0px" }}
          onSubmit={handleSubmit}
        >
          <Modal.Body>
            <div className="d-flex flex-column">
              <div className="d-flex flex-column justify-content-start col-12 align-items-start">
                <div className="d-flex flex-row justify-content-between col-12">
                  {createNewIngredient ? (
                    <div className="d-flex flex-column justify-content-center col-12 mb-3">
                      <div className="d-flex flex-row justify-content-between col-12 mb-1">
                        <input
                          className="col-10 me-2"
                          type="text"
                          id="ingredient_name"
                          name="ingredient_name"
                          style={{
                            backgroundColor: "transparent",
                            borderWidth: "1px",
                            textAlign: "start",
                            height: "40px",
                            paddingLeft: "5px",
                          }}
                          placeholder="Nom du nouvel ingrédient"
                          required
                        />
                        <Button
                          type="button"
                          className="btn btn-primary"
                          title="Revenir à la liste d'ingrédients"
                          onClick={() => {
                            resetSelections();
                            setCreateNewIngredient(false);
                          }}
                        >
                          {"< Retour"}
                        </Button>
                      </div>
                      <div className="d-flex flex-row justify-content-between col-12">
                        {" "}
                        <Select
                          id="categories"
                          className="flex-grow-1 me-1 mt-2"
                          options={category_options}
                          placeholder="Catégorie"
                          isSearchable={true}
                          value={category}
                          onChange={(data) => {
                            setCategory(data);
                          }}
                        />
                        <Select
                          id="sous_categories"
                          className="flex-grow-1 ms-1 mt-2"
                          options={sous_category_options}
                          placeholder="Sous catégorie"
                          isSearchable={true}
                          value={sousCategory}
                          onChange={(data) => {
                            setSousCategory(data);
                          }}
                        />
                      </div>
                      {error.category ? (
                        <p className="form-error">{error.category}</p>
                      ) : null}
                      {error.sousCategory ? (
                        <p className="form-error">{error.sousCategory}</p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="col-12 d-flex flex-row justify-content-between">
                      <Select
                        className="col-10 me-2"
                        options={ingredient_options}
                        placeholder="Choisir un ingrédient"
                        isSearchable={true}
                        value={selectedIngredient}
                        onChange={(data) => {
                          setSelectedIngredient(data);
                          setLabels(
                            data.labels.map((label) => {
                              return {
                                value: label.id,
                                label: label.name,
                              };
                            })
                          );
                        }}
                        required
                      />

                      <Button
                        type="button"
                        className="btn btn-primary"
                        title="Créer un nouvel ingrédient"
                        onClick={() => {
                          resetSelections();
                          setCreateNewIngredient(true);
                        }}
                      >
                        {"+ Créer"}
                      </Button>
                    </div>
                  )}
                </div>
                {error.ingredient ? (
                  <p className="form-error">{error.ingredient}</p>
                ) : null}
                <div className="d-flex flex-row justify-content-start align-items-baseline col-12 mt-2 mb-2">
                  <label
                    className="col-2 me-2"
                    style={{ textAlign: "end" }}
                    htmlFor="quantity"
                  >
                    Quantité:
                  </label>
                  <input
                    className="col-2"
                    type="number"
                    id="quantity"
                    name="quantity"
                    step="any"
                    style={{
                      textAlign: "start",
                    }}
                    required
                  />
                  {createNewUnit ? null : (
                    <div class="d-flex flex-row col-7 ms-2">
                      <select
                        className={"col-8 flex-grow-1"}
                        name="unit"
                        style={{ paddingBottom: 0 }}
                        defaultValue="default"
                        onChange={(e) => {
                          setSelectedUnit(e.target.value);
                        }}
                        required
                      >
                        {selectedIngredient ? (
                          <option disabled value="default">
                            Unité
                          </option>
                        ) : createNewIngredient ? (
                          <option disabled value="kilogramme">
                            Kilogramme
                          </option>
                        ) : (
                          <option disabled value="default">
                            Sélectionnez une unité
                          </option>
                        )}
                        {selectedIngredient
                          ? selectedIngredient.units.map((unit) => (
                              <option value={unit}>{unit}</option>
                            ))
                          : null}
                      </select>
                      <Button
                        type="button"
                        className="btn btn-primary ms-2"
                        title="Créer une unité"
                        onClick={() => {
                          setCreateNewUnit(!createNewUnit);
                        }}
                      >
                        {"+ Créer"}
                      </Button>
                    </div>
                  )}
                </div>
                {error.quantity ? (
                  <p className="form-error">{error.quantity}</p>
                ) : null}
                {error.unit ? <p className="form-error">{error.unit}</p> : null}
                {createNewUnit ? (
                  <div
                    className="d-flex flex-row col-12 justify-content-between align-items-center pt-3 pb-3"
                    style={{
                      border: "solid",
                      borderTopWidth: "1px",
                      borderBottomWidth: "1px",
                      borderRight: 0,
                      borderLeft: 0,
                      borderColor: "#c2c1d1",
                    }}
                  >
                    <div className="d-flex flex-column col-10 justify-content-start ">
                      <div className="d-flex flex-row col-7  align-items-baseline">
                        <label
                          className="col-4 me-2"
                          style={{ textAlign: "end" }}
                          htmlFor="new_unit_conversion"
                        >
                          Nom de l'unité:
                        </label>
                        <input
                          type="text"
                          id="new_unit_name"
                          name="new_unit_name"
                          className="ms-1 flex-grow-1"
                          style={{
                            backgroundColor: "transparent",
                          }}
                          placeholder={"ex: cuillère à soupe"}
                          required
                        />
                      </div>
                      <div className="d-flex flex-row col-7 align-items-baseline mt-2">
                        <label
                          className="col-4 me-2"
                          style={{ textAlign: "end" }}
                          htmlFor="new_unit_conversion"
                        >
                          Conversion en kg:
                        </label>
                        <input
                          type="number"
                          id="new_unit_conversion"
                          name="new_unit_conversion"
                          className="ms-1 flex-grow-1"
                          step="any"
                          placeholder={'ex: pour "gramme", 0.001'}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="btn btn-primary"
                      title="Retourner à la liste d'unités"
                      onClick={() => {
                        setCreateNewUnit(!createNewUnit);
                      }}
                    >
                      {"< Retour"}
                    </Button>
                  </div>
                ) : null}
                <div className="d-flex flex-row justify-content-start mt-2 col-12 flex-grow-1 align-items-center">
                  <label
                    htmlFor="price"
                    className="col-2 me-2"
                    style={{ textAlign: "end" }}
                  >
                    Prix unitaire:
                  </label>
                  <input
                    className="col-2"
                    id="price"
                    type="number"
                    step="any"
                    name="price"
                    required
                  />
                  <label htmlFor="price">€</label>
                </div>
                {error.price ? (
                  <p className="form-error">{error.price}</p>
                ) : null}
              </div>
              <div
                className="col-12 d-flex flex-column justify-content-end"
                style={{
                  marginTop: "25px",
                }}
              >
                <i style={{ color: "grey" }} className="pb-1">
                  Optionnel:
                </i>
                <Select
                  className="flex-grow-1"
                  options={label_options}
                  placeholder="Ajouter des labels"
                  isSearchable={true}
                  value={labels}
                  onChange={(data) => {
                    setLabels(data);
                  }}
                  isMulti
                />
                {error.labels ? (
                  <p className="form-error">{error.labels}</p>
                ) : null}
                <div className="d-flex flex-row justify-content-start align-items-center mt-2 col-12">
                  <label className="me-2" htmlFor="geographic_location">
                    Origine géographique:
                  </label>
                  <input
                    type="text"
                    id="geographic_location"
                    name="geographic_location"
                    step="any"
                    style={{
                      width: "60%",
                    }}
                    placeholder={"Roquefort, Aveyron"}
                  ></input>
                </div>
                {error.geographic_location ? (
                  <p className="form-error">{error.geographic_location}</p>
                ) : null}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
            <Button
              className="btn-secondary"
              type="button"
              onClick={() => {
                setModalOpen(!modalOpen);
                resetSelections();
              }}
            >
              Fermer
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
