import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const CreateNewRecetteButton = ({ component, is_sous_recette = false }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (event.target.name.value) {
      data["name"] = event.target.name.value;
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

  return (
    <>
      <Button className="emoji_button" onClick={() => setModalOpen(!modalOpen)}>
        ➕
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">Créer une nouvelle recette</h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
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
                <div className="d-flex flex-row justify-content-start align-items-baseline col-12">
                  <input
                    className="col-11 mb-2"
                    type="text"
                    id="name"
                    name="name"
                    style={{
                      backgroundColor: "transparent",
                      borderWidth: "1px",
                      borderRadius: 5,
                      textAlign: "start",
                      height: "40px",
                      paddingLeft: "5px",
                    }}
                    placeholder="Nom de la nouvelle recette"
                    required
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

export default CreateNewRecetteButton;
