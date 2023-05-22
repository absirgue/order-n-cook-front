import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { useSWRConfig } from "swr";
import {
  get_all_existing_ingredient_categories_request,
  get_all_existing_ingredient_sous_categories_request,
  create_new_unit_conversion,
} from "../../../../../utils/backend/ingredient_components_requests";
import {
  get_all_existing_ingredients_options,
  create_ingredient_request,
} from "../../../../../utils/backend/ingredient_requests";
import { create_new_recette_ingredient } from "../../../../../utils/backend/recette_components_requests";

/*
A modal that enables creating a RecetteIngredient for the Recette dsplay.
This includes the eventuality of creating a new Ingredient and a new Conversion for a given ingredient (and eventually both).
*/
const AddIngredient = ({
  recette,
  section_id,
  sans_section = false,
  all_ingredients_with_units,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedIngredient, setSelectedIngredient] = React.useState("");
  const [selectedUnit, setSelectedUnit] = React.useState("default");
  const [createNewIngredient, setCreateNewIngredient] = React.useState(false);
  const [createNewUnit, setCreateNewUnit] = React.useState(false);
  const [categoryError, setCategoryError] = React.useState(false);
  const [sousCategoryError, setSousCategoryError] = React.useState(false);
  const [quantityError, setQuantityError] = React.useState(null);
  const [ingredientError, setIngredientError] = React.useState(null);
  const [unitError, setUnitError] = React.useState(null);
  const [category, setCategory] = React.useState(null);
  const [sousCategory, setSousCategory] = React.useState(null);
  const [noteError, setNoteError] = React.useState(null);
  const { mutate } = useSWRConfig();

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

  const category_options = [];

  const sous_category_options = [];

  let ingredient_options = [];

  // Expands on the lists of ingredient options, sous_categories options and categories options to generate
  // option list for the various Select components on the page.
  const generate_option_list = async () => {
    const helper = await get_all_existing_ingredients_options();
    helper.forEach((ingredient) =>
      ingredient_options.push({
        value: ingredient.id,
        label: ingredient.name,
        units: ingredient.units,
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
  };

  // Reset all the error messages to be null.
  const reset_all_errors = () => {
    setQuantityError(null);
    setIngredientError(null);
    setUnitError(null);
    setNoteError(null);
    setCategoryError(null);
    setSousCategoryError(null);
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
      setCategoryError(
        "Veuillez renseigner une catégorie pour ce nouvel ingrédient."
      );
      return null;
    }
    if (sousCategory) {
      ingredient_creation_data["sous_category"] = sousCategory.value;
    } else {
      setSousCategoryError(
        "Veuillez renseigner une sous catégorie pour ce nouvel ingrédient."
      );
      return null;
    }
    console.log("CREATION DATA");
    console.log(ingredient_creation_data);
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
      setIngredientError("Veuillez sélectionner un ingrédient.");
    }
    if (createNewUnit) {
      data["unit"] = await handle_unit_creation(data, event_target);
    } else if (event_target.unit) {
      if (event_target.unit.value === "default") {
        setUnitError("Veuillez renseigner une unité pour cet ingrédient");
      } else {
        data["unit"] = event_target.unit.value;
      }
    } else {
      return null;
    }
    if (event_target.quantity.value && event_target.quantity) {
      data["quantity"] = event_target.quantity.value;
    }
    if (event_target.note && event_target.note.value) {
      data["note"] = event_target.note.value;
    }
    if (section_id) {
      data["section"] = section_id;
    }
    data["recette"] = recette.id;

    if (data["ingredient"] != null && data["unit"] != null) {
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
    mutate(`http://127.0.0.1:8000/api/recettes/${recette.id}/`);
    reset_all_errors();
    resetSelections();
    setModalOpen(!modalOpen);
  }

  /** Handles behavior on a successful RecetteIngredient creation request.
   * This consists in:
   *      - setting the field specific errors to show to the user
   *      - OR (if no specific error is detected) showing an alert dialog
   */
  function handleError(result) {
    let error_found = false;
    if (result.hasOwnProperty("quantity")) {
      setQuantityError(result.quantity);
      error_found = true;
    }
    if (result.hasOwnProperty("unit")) {
      setUnitError(result.unit);
      error_found = true;
    }
    if (result.hasOwnProperty("ingredient")) {
      setIngredientError(result.ingredient);
      error_found = true;
    }
    if (result.hasOwnProperty("note")) {
      setNoteError(result.note);
      error_found = true;
    }
    if (!error_found) {
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
    console.log("TOTAL DATA");
    console.log(assembledData);
    if (assembledData) {
      const response = await create_new_recette_ingredient(assembledData);
      if (response.status == 201) {
        handleSuccess();
      } else {
        const result = await response.json();
        handleError(result);
      }
    }
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

  return (
    <>
      <Button
        className="btn btn-primary mb-2"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Ajouter un ingrédient{sans_section ? null : " à cette section"}
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">
            {createNewIngredient
              ? "Créer un nouvel ingrédient et l'ajouter à la section"
              : "Ajouter un ingrédient"}
            {!createNewIngredient && sans_section ? null : " à cette section"}
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
          <ModalBody>
            <div className="d-flex flex-column">
              <div className="d-flex flex-column justify-content-start col-12 align-items-start">
                <div className="d-flex flex-row justify-content-between col-12">
                  {createNewIngredient ? (
                    <div className="d-flex flex-column justify-content-center col-12 mb-3">
                      <div className="d-flex flex-row justify-content-between col-12 mb-1">
                        <input
                          className="col-11 mb-2"
                          type="text"
                          id="ingredient_name"
                          name="ingredient_name"
                          style={{
                            backgroundColor: "transparent",
                            borderWidth: "1px",
                            borderRadius: 5,
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
                          style={{ aspectRatio: "1/1" }}
                          title="Revenir à la liste d'ingrédients"
                          onClick={() => {
                            resetSelections();
                            setCreateNewIngredient(false);
                          }}
                        >
                          {"<"}
                        </Button>
                      </div>
                      <div className="d-flex flex-row justify-content-between col-12">
                        {" "}
                        <Select
                          id="categories"
                          className="flex-grow-1 me-1"
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
                          className="flex-grow-1 ms-1"
                          options={sous_category_options}
                          placeholder="Sous catégorie"
                          isSearchable={true}
                          value={sousCategory}
                          onChange={(data) => {
                            setSousCategory(data);
                          }}
                        />
                      </div>
                      {categoryError ? (
                        <p className="form-error">{categoryError}</p>
                      ) : null}
                      {sousCategoryError ? (
                        <p className="form-error">{sousCategoryError}</p>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <Select
                        className="col-11 mb-2"
                        options={ingredient_options}
                        placeholder="Choisir un ingrédient"
                        isSearchable={true}
                        value={selectedIngredient}
                        onChange={(data) => {
                          setSelectedIngredient(data);
                          console.log("SELECTED");
                          console.log(selectedIngredient);
                        }}
                        required
                      />

                      <Button
                        type="button"
                        className="btn btn-primary"
                        style={{ aspectRatio: "1/1" }}
                        title="Créer un nouvel ingrédient"
                        onClick={() => {
                          resetSelections();
                          setCreateNewIngredient(true);
                        }}
                      >
                        {"+"}
                      </Button>
                    </>
                  )}
                </div>
                {ingredientError ? (
                  <p className="form-error">{ingredientError}</p>
                ) : null}
                <div className="d-flex flex-row justify-content-start align-items-baseline">
                  <label htmlFor="quantity">Quantité:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    step="any"
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    placeholder={"3"}
                    required
                  />
                  {createNewUnit ? null : (
                    <div class="d-flex flex-row col-8 ps-1 ms-2 mt-1">
                      <select
                        className={"btn col-10 me-1 flex-grow-1"}
                        name="unit"
                        style={{
                          backgroundColor: "#CDCCCD",
                          textAlign: "start",
                        }}
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
                        className="btn btn-primary col-2 flex-grow-1"
                        style={{ aspectRatio: "1/1", maxHeight: "50px" }}
                        title="Créer une unité"
                        onClick={() => {
                          setCreateNewUnit(!createNewUnit);
                        }}
                      >
                        {"+"}
                      </Button>
                    </div>
                  )}
                </div>
                {quantityError ? (
                  <p className="form-error">{quantityError}</p>
                ) : null}
                {unitError ? <p className="form-error">{unitError}</p> : null}
                {createNewUnit ? (
                  <div className="d-flex flex-row col-10 justify-content-between mt-3 align-items-center">
                    <div className="d-flex flex-column col-11 justify-content-start ">
                      <div className="d-flex flex-row col-12  align-items-baseline">
                        <label htmlFor="new_unit_conversion">
                          Nom de l'unité:
                        </label>
                        <input
                          type="text"
                          id="new_unit_name"
                          name="new_unit_name"
                          className="ms-1 flex-grow-1"
                          style={{
                            backgroundColor: "transparent",
                            border: 0,
                            borderBottom: "5px",
                            textAlign: "start",
                            width: "100px",
                          }}
                          placeholder={"ex: cuillère à soupe"}
                          required
                        />
                      </div>
                      <div className="d-flex flex-row col-12 align-items-baseline">
                        <label htmlFor="new_unit_conversion">
                          Conversion en kg:
                        </label>
                        <input
                          type="number"
                          id="new_unit_conversion"
                          name="new_unit_conversion"
                          className="ms-1 flex-grow-1"
                          step="any"
                          style={{
                            backgroundColor: "transparent",
                            border: 0,
                            borderBottom: "5px",
                            textAlign: "start",
                            width: "100px",
                          }}
                          placeholder={'ex: pour "gramme", 0.001'}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="btn btn-primary col-2"
                      style={{ aspectRatio: "1/1", maxHeight: "50px" }}
                      title="Retourner à la liste d'unités"
                      onClick={() => {
                        setCreateNewUnit(!createNewUnit);
                      }}
                    >
                      {"<"}
                    </Button>
                  </div>
                ) : null}
                <div className="d-flex flex-row justify-content-start mt-2">
                  <label htmlFor="note" className="col-3">
                    Note (optionnel):
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows="2"
                    cols="50"
                    className="col-9"
                    placeholder="émondées"
                  />
                </div>
                {noteError ? <p className="form-error">{noteError}</p> : null}
              </div>
              <div className="col-12 d-flex flex-row justify-content-end mt-2"></div>
            </div>
          </ModalBody>
          <ModalFooter>
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
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default AddIngredient;
