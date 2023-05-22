import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { useSWRConfig } from "swr";
import {
  get_all_possible_sous_recette,
  create_sous_recette,
} from "../../../../../utils/backend/recette_components_requests";

/*
A modal to create a Sous Recette for the Recette on display.
This presents a form comporting a searchable list of all possible sous recette
*/
const AddSousRecette = ({ recette_id }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRecette, setSelectedRecette] = React.useState("");
  const [selectedUnit, setSelectedUnit] = React.useState("default");
  const [sousRecetteError, setRecetteError] = React.useState(null);
  const [quantityError, setQuantityError] = React.useState(null);
  const [noteError, setNoteError] = React.useState(null);

  const { mutate } = useSWRConfig();

  const recette_options = [];
  const generate_option_list = async () => {
    const all_existing_sous_recette = await get_all_possible_sous_recette(
      recette_id
    );
    all_existing_sous_recette.forEach((recette) =>
      recette_options.push({
        value: recette.id,
        label: recette.name,
        unit: recette.unit,
      })
    );
  };

  const reset_all_errors = () => {
    setRecetteError(null);
    setQuantityError(null);
    setNoteError(null);
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
    if (selectedRecette) {
      data["sous_recette"] = selectedRecette.value;
    }
    data["recette"] = recette_id;

    const response = await create_sous_recette(data);
    if (response.status == 201) {
      setModalOpen(false);
      reset_all_errors();
      mutate(`http://127.0.0.1:8000/api/general/recettes/${recette_id}/`);
    } else {
      const result = await response.json();
      let error_found = false;
      if (result.hasOwnProperty("note")) {
        setNoteError(result.note);
        error_found = true;
      }
      if (result.hasOwnProperty("sous_recette")) {
        setNoteError(result.sous_recette);
        error_found = true;
      }
      if (result.hasOwnProperty("quantity")) {
        setNoteError(result.quantity);
        error_found = true;
      }
      if (!error_found) {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées et de réessayer ultérieurement."
        );
      }
    }
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
                {sousRecetteError ? (
                  <p className="form-error">{sousRecetteError}</p>
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
                  {selectedRecette ? (
                    <p style={{ marginBottom: "0px" }}>
                      {selectedRecette.unit}
                    </p>
                  ) : null}
                </div>
                {quantityError ? (
                  <p className="form-error">{quantityError}</p>
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
              </div>
              {noteError ? <p className="form-error">{noteError}</p> : null}
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
