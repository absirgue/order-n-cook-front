import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useSWRConfig } from "swr";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/

const RecetteComponentModifier = ({
  component,
  is_sous_recette = false,
  recette_id,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState("default");
  const [untiError, setUnitError] = React.useState(null);
  const [quantityError, setQuantityError] = React.useState(null);
  const [noteError, setNoteError] = React.useState(null);
  const [possibleUnit, setPossibleUnit] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { mutate } = useSWRConfig();

  function resetAllErrors() {
    setUnitError(null);
    setQuantityError(null);
    setNoteError(null);
  }

  async function get_possible_units() {
    const endpoint =
      "http://127.0.0.1:8000/api/ingredient_units/" +
      component.ingredient_id +
      "/";
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    return result;
  }
  const load_possible_units = async () => {
    if (!is_sous_recette && !isLoaded) {
      const data = await get_possible_units();
      setPossibleUnit(data.units.map((unit) => unit.unit));
      setIsLoaded(true);
    }
  };

  load_possible_units();

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (!is_sous_recette) {
      if (
        event.target.unit.value &&
        event.target.unit.value != component.unit &&
        event.target.unit.value != "default"
      ) {
        data["unit"] = event.target.unit.value;
      }
    }

    if (
      event.target.quantity.value &&
      event.target.quantity.value != component.quantity
    ) {
      data["quantity"] = event.target.quantity.value;
    }
    if (
      event.target.note.value != component.note ||
      (!event.target.note.value && component.note != "")
    ) {
      data["note"] = event.target.note.value;
    }

    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    let endpoint = "http://127.0.0.1:8000/api/";
    if (!is_sous_recette) {
      endpoint += "recette_ingredients/";
    } else {
      endpoint += "sous_recette/";
    }
    endpoint += component.id + "/";
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

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    if (response.status == 200) {
      resetAllErrors();
      setModalOpen(false);
      mutate(`http://127.0.0.1:8000/api/recettes/${recette_id}/`);
    } else {
      let error_found = false;
      if (result.hasOwnProperty("quantity")) {
        setQuantityError(result.quantity);
        error_found = true;
      }
      if (result.hasOwnProperty("unit")) {
        setUnitError(result.unit);
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
                <div className="d-flex flex-row justify-content-start align-items-center col-12 mb-2">
                  <label
                    className="col-3 me-2"
                    htmlFor="quantity"
                    style={{ textAlign: "end" }}
                  >
                    Quantité:
                  </label>
                  <input
                    className="col-3 me-2"
                    type="number"
                    id="quantity"
                    name="quantity"
                    step="any"
                    defaultValue={
                      component.quantity ? component.quantity.toString() : null
                    }
                    placeholder={component.quantity ? "" : "quantité?"}
                  ></input>
                  {is_sous_recette ? (
                    <p style={{ marginBottom: "0px" }}>{component.unit}</p>
                  ) : (
                    <select
                      style={{ paddingBottom: 0 }}
                      className={"col-5 ps-1"}
                      name="unit"
                      value={selectedUnit}
                      onChange={(e) => {
                        setSelectedUnit(e.target.value);
                      }}
                      required
                    >
                      <option disabled value="default">
                        {component.unit
                          ? component.unit.toLowerCase()
                          : "unité"}
                      </option>
                      {possibleUnit
                        ? possibleUnit.map((unit) => {
                            return <option value={unit}>{unit}</option>;
                          })
                        : null}
                    </select>
                  )}
                </div>
              </div>
              {quantityError ? (
                <p className="form-error">{quantityError}</p>
              ) : null}
              {untiError ? <p className="form-error">{untiError}</p> : null}
              <div className="d-flex flex-row justify-content-start mt-2">
                <label
                  htmlFor="note"
                  className="col-3 me-2"
                  style={{ textAlign: "end" }}
                >
                  Note (optionnel):
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows="2"
                  cols="50"
                  className="flex-grow-1"
                  style={{ borderColor: "#c2c1d1" }}
                >
                  {component.note}
                </textarea>
              </div>
              {noteError ? <p className="form-error">{noteError}</p> : null}
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
