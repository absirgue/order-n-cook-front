import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useSWRConfig } from "swr";
import { create_progression_element_request } from "../../../../../utils/backend/recette_components_requests";

/*
A modal that enables creating a new Progression Element for the Recette on display.
*/
const AddProgressionElement = ({
  sans_section = false,
  recette,
  section_number = null,
  section_max_number = null,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [noteError, setNoteError] = React.useState(null);
  const { mutate } = useSWRConfig();

  function get_initial_rank_value(section) {
    if (section_max_number) {
      console.log("SECTION MAX");
      console.log(section_max_number);
      return section_max_number + 1;
    } else if (
      recette.progression_elements &&
      recette.progression_elements.length > 0
    ) {
      let maximum = 0;
      if (section) {
        for (let element of recette.progression_elements.filter(
          (element) => element.section && element.section == section_number
        )) {
          if (element.rank > maximum) {
            maximum = element.rank;
          }
        }
      } else {
        for (let element of recette.progression_elements.filter(
          (element) => !element.section
        )) {
          if (element.rank > maximum) {
            maximum = element.rank;
          }
        }
      }
      return maximum + 1;
    } else {
      return 1;
    }
  }
  function reset_all_errors() {
    setNoteError(null);
  }
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (
      event.target.progression_element &&
      event.target.progression_element.value
    ) {
      data["text"] = event.target.progression_element.value;
    }
    if (section_number) {
      data["section"] = section_number;
    }
    data["recette"] = recette.id;
    data["rank"] = get_initial_rank_value(section_number);
    const response = await create_progression_element_request(data);
    if (response.status == 201) {
      setModalOpen(false);
      reset_all_errors();
      mutate(`http://127.0.0.1:8000/api/recettes/${recette.id}/`);
    } else {
      const result = await response.json();
      let error_found = false;
      if (result.hasOwnProperty("text")) {
        setNoteError(result.text);
        error_found = true;
      }
      if (!error_found) {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées et de réessayer ultérieurement."
        );
      }
    }
    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
  };

  return (
    <>
      <Button
        className="btn btn-primary mb-2 col-12"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Ajouter un élément de progression 
        {sans_section ? null : "à cette section"}
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">
            Ajouter un élément de progression{" "}
            {sans_section ? null : "à cette section"}
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
                <div className="d-flex flex-row justify-content-start align-items-baseline col-12">
                  <textarea
                    className="col-12"
                    name="progression_element"
                    rows="8"
                    cols="200"
                    placeholder="Entrer l'élément de progression"
                    required
                  ></textarea>
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

export default AddProgressionElement;
