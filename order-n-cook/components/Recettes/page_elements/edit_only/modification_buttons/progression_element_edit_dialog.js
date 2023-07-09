import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useSWRConfig } from "swr";

/**
 * Faciliates the editing of a Progression Element.
 */
const ProgressionElementEditHelper = ({ progression_element, recette_id }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [noteError, setNoteError] = useState(null);
  const { mutate } = useSWRConfig();

  function reset_all_errors() {
    setNoteError(null);
  }
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (event.target.text && event.target.text.value) {
      data["text"] = event.target.text.value;
      const JSONdata = JSON.stringify(data);

      // API endpoint where we send form data.
      const endpoint =
        `http://127.0.0.1:8000/api/recette_progression/` +
        progression_element.id +
        "/";

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
      if (response.status == 200) {
        setOpenEditModal(false);
        reset_all_errors();
        mutate(`http://127.0.0.1:8000/api/recettes/${recette_id}/`);
      } else {
        const result = await response.json();
        let error_found = false;
        if (result.hasOwnProperty("text")) {
          setNoteError(result.note);
          error_found = true;
        }
        if (!error_found) {
          alert(
            "Une erreur est survenue. Merci de vérifier les valeurs renseignées et de réessayer ultérieurement."
          );
        }
      }
    }

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
  };
  return (
    <>
      <Button
        className="emoji_button col-6"
        onClick={() => setOpenEditModal(true)}
      >
        🖊
      </Button>
      <Modal
        toggle={() => setOpenEditModal(!openEditModal)}
        isOpen={openEditModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Modifier l'élément de progression</h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setOpenEditModal(!openEditModal)}
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
              <div className="d-flex flex-row justify-content-start mt-2">
                <label htmlFor="text" className="col-3">
                  Texte:
                </label>
                <textarea
                  id="text"
                  name="text"
                  rows="5"
                  cols="150"
                  className="col-9"
                  style={{ borderColor: "#c2c1d1" }}
                >
                  {progression_element.text}
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
              onClick={() => setOpenEditModal(!openEditModal)}
            >
              Fermer
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default ProgressionElementEditHelper;
