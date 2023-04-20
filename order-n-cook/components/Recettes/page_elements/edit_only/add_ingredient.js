import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const AddIngredient = ({ section_id, sans_section = false }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedIngredient, setSelectedIngredient] = React.useState("");
  const [selectedUnit, setSelectedUnit] = React.useState("default");
  const [createNewIngredient, setCreateNewIngredient] = React.useState(false);

  const possible_units = ["kilogramme", "gramme", "littre"];
  const all_existing_ingredients = [
    { name: "sole", id: 1 },
    { name: "banane", id: 2 },
    { name: "pomme de terre", id: 3 },
    { name: "sel", id: 4 },
    { name: "beurre", id: 5 },
  ];
  const ingredient_options = [];

  const generate_option_list = () => {
    all_existing_ingredients.forEach((ingredient) =>
      ingredient_options.push({ value: ingredient.id, label: ingredient.name })
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
    if (event.target.note.value) {
      data["note"] = event.target.note.value;
    }
    try {
      if (event.target.ingredient_name.value) {
        data["ingredient_name"] = event.target.ingredient_name.value;
      }
    } catch {
      // no new ingredient was created
    }

    const JSONdata = JSON.stringify(data);
    console.log(JSONdata);

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

  const resetSelections = () => {
    console.log("CALLED RESET");
    setSelectedIngredient("");
    setSelectedUnit("default");
    setCreateNewIngredient(false);
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
          >
            <span>×</span>
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
                    <>
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
                        placeholder="Le nom d'un nouvel ingrédient"
                        required
                      />
                      <Button
                        type="button"
                        className="btn btn-primary"
                        style={{ aspectRatio: "1/1" }}
                        onClick={() => {
                          setCreateNewIngredient(!createNewIngredient);
                        }}
                      >
                        {"<"}
                      </Button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Select
                        className="col-11 mb-2"
                        options={ingredient_options}
                        placeholder="Choisir un ingrédient"
                        isSearchable={true}
                        value={selectedIngredient}
                        onChange={(data) => setSelectedIngredient(data)}
                        required
                      />
                      <Button
                        type="button"
                        className="btn btn-primary"
                        style={{ aspectRatio: "1/1" }}
                        onClick={() => {
                          console.log("HERE");
                          setCreateNewIngredient(!createNewIngredient);
                        }}
                      >
                        {"+"}
                      </Button>
                    </>
                  )}
                </div>

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
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    name="unit"
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    value={selectedUnit}
                    onChange={(e) => {
                      setSelectedUnit(e.target.value);
                    }}
                    required
                  >
                    <option disabled value="default">
                      Unité
                    </option>
                    {possible_units.map((unit) => (
                      <option value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

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
