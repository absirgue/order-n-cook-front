import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { useSWRConfig } from "swr";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
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

  async function get_all_existing_ingredients_options() {
    const response = await fetch(
      `http://127.0.0.1:8000/api/all_ingredient_and_units/`,
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
    return resData;
  }

  async function get_all_existing_categories() {
    const response = await fetch(
      `http://127.0.0.1:8000/api/ingredient_categories/`,
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

  async function get_all_existing_sous_categories() {
    const response = await fetch(
      `http://127.0.0.1:8000/api/ingredient_sous_categories/`,
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

  const category_options = [];

  const sous_category_options = [];

  let ingredient_options = [];

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

  const reset_all_errors = () => {
    setQuantityError(null);
    setIngredientError(null);
    setUnitError(null);
    setNoteError(null);
    setCategoryError(null);
    setSousCategoryError(null);
  };

  generate_option_list();

  async function assembleDataObject(event_target) {
    let data = {};
    if (createNewIngredient) {
      let ingredient_creation_data = {};
      if (event_target.ingredient_name.value) {
        ingredient_creation_data["name"] = event_target.ingredient_name.value;
      }
      if (category) {
        data["category"] = category.value;
      } else {
        setCategoryError(
          "Veuillez renseigner une catégorie pour ce nouvel ingrédient."
        );
        return null;
      }
      if (sousCategory) {
        data["sous_category"] = sousCategory.value;
      } else {
        setSousCategoryError(
          "Veuillez renseigner une sous catégorie pour ce nouvel ingrédient."
        );
        return null;
      }
      const JSONdata = JSON.stringify(ingredient_creation_data);

      // API endpoint where we send form data.
      const endpoint = "http://127.0.0.1:8000/api/ingredients/";

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
      if (response.status == 201) {
        const result = await response.json();
        data["ingredient"] = result.id;
      } else {
        return null;
      }
    } else if (selectedIngredient) {
      data["ingredient"] = selectedIngredient.value;
    } else {
      setIngredientError("Veuillez sélectionner un ingrédient.");
    }
    if (createNewUnit) {
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
      console.log("PROBLEME ICI");
      console.log(create_unit_data);

      const JSONdata = JSON.stringify(create_unit_data);

      // API endpoint where we send form data.
      const endpoint = "http://127.0.0.1:8000/api/conversion_rate/";

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
      if (response.status == 201) {
        const result = await response.json();
        data["unit"] = result.unit;
      } else {
        return null;
      }
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

    return data;
  }

  function handleSuccess() {
    mutate(`http://127.0.0.1:8000/api/recettes/${recette.id}/`);
    reset_all_errors();
    resetSelections();

    setModalOpen(!modalOpen);
  }

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

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const assembledData = await assembleDataObject(event.target);
    if (assembledData) {
      const JSONdata = JSON.stringify(assembledData);

      // API endpoint where we send form data.
      const endpoint = "http://127.0.0.1:8000/api/recette_ingredients/";

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

      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const result = await response.json();
      console.log(response);
      if (response.status == 201) {
        handleSuccess();
      } else {
        handleError(result);
      }
    } else {
      alert(
        "Une erreur est survenue. Merci de vérifier votre saisie et de réessayer plus tard."
      );
    }
  };
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
                            setCreateNewIngredient(!createNewIngredient);
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
                          setCreateNewIngredient(!createNewIngredient);
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
                            Sélectionnez un ingrédient
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
