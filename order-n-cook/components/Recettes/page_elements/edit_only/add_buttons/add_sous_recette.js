import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const AddSousRecette = ({ section_id }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRecette, setSelectedRecette] = React.useState("");
  const [selectedUnit, setSelectedUnit] = React.useState("default");

  const possible_units = ["kilogramme", "gramme", "littre"];
  const all_existing_recettes = [
    { name: "Recette n1", id: 1 },
    { name: "Recette n2", id: 2 },
    { name: "Recette n3", id: 3 },
    { name: "Recette n4", id: 4 },
    { name: "Recette n5", id: 5 },
  ];
  const recette_options = [];

  const generate_option_list = () => {
    all_existing_recettes.forEach((recette) =>
      recette_options.push({ value: recette.id, label: recette.name })
    );
  };
  generate_option_list();

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (event.target.unit && event.target.unit.value) {
      data["unit"] = event.target.unit.value;
    }
    if (event.target.quantity && event.target.quantity.value) {
      data["quantity"] = event.target.quantity.value;
    }
    if (event.target.note && event.target.note.value) {
      data["note"] = event.target.note.value;
    }

    const JSONdata = JSON.stringify(data);

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

  const resetSelection = () => {
    setSelectedRecette("");
    setSelectedUnit("default");
  };

  return (
    <>
      <Button
        className="btn btn-primary mb-2 col-12"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Ajouter une sous recette
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">Ajouter une sous recette</h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => {
              setModalOpen(!modalOpen);
              resetSelection();
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
                  <Select
                    className="col-12 mb-2"
                    options={recette_options}
                    placeholder="Choisir une recette"
                    isSearchable={true}
                    value={selectedRecette}
                    onChange={(data) => setSelectedRecette(data)}
                    required
                  />
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
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    value={selectedUnit}
                    onChange={(e) => {
                      setSelectedUnit(e.target.value);
                    }}
                    name="unit"
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
                resetSelection();
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

export default AddSousRecette;
