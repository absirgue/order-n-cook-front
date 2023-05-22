import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";
import Select from "react-select";

export default function AddProduit({ fournisseur_id }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [createNewIngredient, setCreateNewIngredient] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("default");
  const [ingredientError, setIngredientError] = useState(null);
  const [unitError, setUnitError] = useState(null);
  const [category, setCategory] = useState(null);
  const [sousCategory, setSousCategory] = useState(null);
  const [noteError, setNoteError] = useState(null);
  const [createNewUnit, setCreateNewUnit] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [sousCategoryError, setSousCategoryError] = useState(false);
  const [quantityError, setQuantityError] = useState(null);

  const category_options = [];

  const sous_category_options = [];

  let ingredient_options = [];

  function get_all_existing_ingredients_options() {
    return [{ id: 1, name: "ingredient 1", units: ["unit"] }];
  }

  function get_all_existing_categories() {
    return ["cat 1", "cat 2"];
  }

  function get_all_existing_sous_categories() {
    return ["sous cat 1", "sous cat 2"];
  }

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

  function handleSubmit() {}
  return (
    <>
      <Button className="btn-primary" onClick={() => setModalOpen(true)}>
        Ajouter un produit
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
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
                <div className="d-flex flex-row justify-content-start mt-2 col-12 flex-grow-1 align-items-center">
                  <label htmlFor="price">Prix unitaire:</label>
                  <input
                    id="price"
                    type="number"
                    step="any"
                    name="price"
                    className="ms-1"
                    style={{ maxWidth: "100px", textAlign: "end" }}
                    placeholder={2.2}
                  />
                  <label htmlFor="price">€</label>
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
}
