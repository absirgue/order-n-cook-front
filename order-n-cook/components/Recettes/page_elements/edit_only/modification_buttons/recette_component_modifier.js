import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const RecetteComponentModifier = ({ component, is_sous_recette = false }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState("default");

  const possible_units = ["kilogramme", "gramme", "littre"];
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (event.target.unit.value && event.target.unit.value != component.unit) {
      data["unit"] = event.target.unit.value;
    }
    if (
      event.target.quantity.value &&
      event.target.quantity.value != component.quantity
    ) {
      data["quantity"] = event.target.quantity.value;
    }
    if (event.target.note.value && event.target.note.value != component.note) {
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

  return (
    <>
      <Button className="emoji_button" onClick={() => setModalOpen(!modalOpen)}>
        🖊
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">
            Modifier {is_sous_recette ? " la sous recette " : " l'ingrédient "}
            {component.name.toLowerCase()}
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
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
                    defaultValue={
                      component.quantity ? component.quantity.toString() : null
                    }
                    placeholder={component.quantity ? "" : "quantité?"}
                  ></input>
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
                >
                  {component.note}
                </textarea>
              </div>
            </div>
            <div className="col-12 d-flex flex-row justify-content-end mt-2"></div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
            <Button
              className="btn-secondary"
              type="button"
              onClick={() => setModalOpen(!modalOpen)}
            >
              Fermer
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default RecetteComponentModifier;
