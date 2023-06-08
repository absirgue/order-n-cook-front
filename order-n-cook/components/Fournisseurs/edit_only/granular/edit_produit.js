import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useSWRConfig } from "swr";
import Select from "react-select";
import { get_all_existing_labels } from "../../../../utils/backend/ingredient_requests";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/

const EditProduit = ({ produit, fournisseur_id }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState("default");
  const [error, setError] = React.useState({});
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [possibleUnit, setPossibleUnit] = React.useState(["kilo", "test"]);
  const [labels, setLabels] = React.useState(
    produit.labels?.map((label) => {
      return { value: label.id, label: label.name };
    })
  );

  const { mutate } = useSWRConfig();

  async function get_possible_units() {
    console.log("ID OF INGREDIENT");
    console.log(produit.ingredient.id);
    const endpoint =
      "http://127.0.0.1:8000/api/ingredient_units/" +
      produit.ingredient.id +
      "/";
    console.log(endpoint);
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
    if (!isLoaded) {
      const data = await get_possible_units();
      console.log("DATA of POSSIBLE UNITS");
      console.log(data);
      setPossibleUnit(data.units.map((unit) => unit.unit));
      console.log("RESULTED IN");
      console.log(possibleUnit);
      setIsLoaded(true);
    }
  };

  load_possible_units();

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    // Get data from the form.
    let data = {};

    if (
      event.target.unit.value &&
      event.target.unit.value != produit.unit &&
      event.target.unit.value != "default"
    ) {
      data["unit"] = event.target.unit.value;
    }

    if (
      event.target.quantity.value &&
      event.target.quantity.value != produit.quantity
    ) {
      data["quantity"] = event.target.quantity.value;
    }
    if (
      event.target.geographic_origin.value != produit.geographic_origin ||
      (!event.target.geographic_origin.value && produit.geographic_origin != "")
    ) {
      data["geographic_origin"] = event.target.geographic_origin.value;
    }
    if (
      event.target.price.value != produit.price ||
      (!event.target.price.value && produit.price != "")
    ) {
      data["price"] = event.target.price.value;
    }

    if (
      labels.map((label) => label.value) !=
      produit.labels.map((label) => label.id)
    ) {
      data["labels"] = labels.map((label) => label.value);
    }
    const JSONdata = JSON.stringify(data);
    // API endpoint where we send form data.
    let endpoint = "http://127.0.0.1:8000/api/produits/" + produit.id + "/";

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
    console.log(produit);
    console.log(response);
    const result = await response.json();
    if (response.status == 200) {
      setModalOpen(false);
      mutate(`http://127.0.0.1:8000/api/fournisseurs/${fournisseur_id}/`);
    } else {
      let error_found = false;
      if (
        result.hasOwnProperty("quantity") ||
        result.hasOwnProperty("unit") ||
        result.hasOwnProperty("price") ||
        result.hasOwnProperty("geographic_origin") ||
        result.hasOwnProperty("labels")
      ) {
        error_found = true;
        setError(result);
      }

      if (!error_found) {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées et de réessayer ultérieurement."
        );
      }
    }
  };

  var labelData = get_all_existing_labels();
  console.log("LABELS");
  console.log(labelData);

  const label_options = [];

  const generate_option_list = async () => {
    labelData = await get_all_existing_labels();
    labelData.forEach((label) =>
      label_options.push({ value: label.id, label: label.name })
    );
  };
  generate_option_list();

  return (
    <>
      <Button className="emoji_button" onClick={() => setModalOpen(!modalOpen)}>
        🖊
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">
            Modifier le produit: {produit.ingredient.name.toLowerCase()}
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
                    step="any"
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    defaultValue={
                      produit.real_unit.quantity
                        ? produit.real_unit.quantity.toString()
                        : null
                    }
                    placeholder={produit.real_unit.quantity ? "" : "quantité?"}
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
                      {produit.real_unit.unit
                        ? produit.real_unit.unit.toLowerCase()
                        : "unité"}
                    </option>
                    x
                    {possibleUnit
                      ? possibleUnit.map((unit) => {
                          console.log("HERE UNIT");
                          console.log(unit);
                          return <option value={unit}>{unit}</option>;
                        })
                      : null}
                  </select>
                </div>
                <div className="d-flex flex-row justify-content-start align-items-baseline mt-1">
                  <label htmlFor="price">Prix unitaire:</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="any"
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "end",
                      width: "100px",
                    }}
                    defaultValue={produit.price ? produit.price : null}
                    placeholder={produit.price ? null : 2.21}
                  ></input>
                  <label htmlFor="price">€</label>
                </div>
                <Select
                  className="flex-grow-1 col-12"
                  options={label_options}
                  placeholder="Ajouter des labels"
                  isSearchable={true}
                  value={labels}
                  onChange={(data) => {
                    setLabels(data);
                  }}
                  isMulti
                />
                <div className="d-flex flex-row justify-content-start align-items-baseline mt-1 col-12">
                  <label htmlFor="geographic_origin">
                    Origine géographique:
                  </label>
                  <input
                    type="text"
                    id="geographic_origin"
                    name="geographic_origin"
                    step="any"
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      borderBottom: "5px",
                      textAlign: "start",
                      width: "60%",
                    }}
                    defaultValue={
                      produit.provenance ? produit.provenance : null
                    }
                    placeholder={
                      produit.provenance ? null : "ex: Roquefort, Aveyron"
                    }
                  ></input>
                </div>
              </div>
              {error.quantity ? (
                <p className="form-error">{error.quantity}</p>
              ) : null}
              {error.unit ? <p className="form-error">{error.unit}</p> : null}
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

export default EditProduit;
