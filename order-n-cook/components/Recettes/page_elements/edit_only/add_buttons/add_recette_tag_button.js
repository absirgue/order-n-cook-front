import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";
import { useSWRConfig } from "swr";
const AddRecetteTagButton = ({
  is_category = false,
  is_taste = false,
  is_genre = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [nameInput, setNameInput] = useState(null);
  const { mutate } = useSWRConfig();
  const handleTagCreation = async () => {
    let data = {};
    console.log("NAME INPUT");
    console.log(nameInput);
    if (nameInput) {
      data["name"] = nameInput;
      const JSONdata = JSON.stringify(data);

      // API endpoint where we send form data.
      let endpoint = "http://127.0.0.1:8000/api/";
      if (is_category) {
        endpoint += "recette_categories/";
      } else if (is_genre) {
        endpoint += "recette_genres/";
      } else if (is_taste) {
        endpoint += "recette_tastes/";
      }

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
        if (is_category) {
          mutate("http://127.0.0.1:8000/api/recette_categories/");
        } else if (is_genre) {
          mutate("http://127.0.0.1:8000/api/recette_genres/");
        } else if (is_taste) {
          mutate("http://127.0.0.1:8000/api/recette_tastes/");
        }
        setModalOpen(false);
        setNameError(null);
      } else {
        const result = await response.json();
        let error_found = false;
        if (result.hasOwnProperty("name")) {
          setNameError(result.name);
          error_found = true;
        }
        if (!error_found) {
          alert(
            "Une erreur est survenue. Merci de vérifier les valeurs renseignées et de réessayer ultérieurement."
          );
        }
      }
    }
  };

  return (
    <>
      <Button onClick={() => setModalOpen(!modalOpen)}>{"+"}</Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">
            Ajouter{" "}
            {is_category
              ? "une catégorie"
              : is_taste
              ? "un goût"
              : is_genre
              ? "un genre"
              : null}
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            style={{ backgroundColor: "transparent", border: 0 }}
            onClick={() => {
              setModalOpen(!modalOpen);
              setNameError(null);
            }}
          >
            ×
          </button>
        </div>

        <ModalBody className="pt-1">
          <div className="d-flex flex-column ">
            <div className="d-flex flex-column justify-content-start col-12 align-items-start">
              <input
                className="col-11 mb-2"
                type="text"
                id="name"
                name="name"
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  backgroundColor: "transparent",
                  borderWidth: "1px",
                  borderRadius: 5,
                  textAlign: "start",
                  height: "40px",
                  paddingLeft: "5px",
                }}
                placeholder="Nom de la nouvelle section"
                required
              />
            </div>
          </div>
          <div className="col-12 d-flex flex-row justify-content-end mt-2"></div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handleTagCreation}>
            Enregistrer
          </button>
          <Button
            className="btn-secondary"
            type="button"
            onClick={() => {
              setModalOpen(!modalOpen);
              setNameError(null);
            }}
          >
            Fermer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddRecetteTagButton;
