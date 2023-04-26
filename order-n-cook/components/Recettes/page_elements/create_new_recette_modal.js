import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const CreateNewRecetteButton = ({ component, is_sous_recette = false }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [category,setCategory] = React.useState(null);
  async function get_all_existing_recette_categories() {
    const response = await fetch(
      `http://127.0.0.1:8000/api/recette_categories/`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    // Awaiting response.json()
    const resData = await response.json();

    // Return response data
    return resData.map((obj) => obj.name);
  }

  const category_options = [];

  const generate_option_list = async () => {
    const all_existing_recette_categories =
      await get_all_existing_recette_categories();
    all_existing_recette_categories.forEach((category) =>
      category_options.push({ value: category, label: category })
    );
  };

  generate_option_list();

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    let data = {};
    if (event.target.name.value) {
      data["name"] = event.target.name.value;
    }
    console.log("Catégorie")
    console.log(category)
    if (category != null){
      data["category"] = category.value;
      const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = "http://127.0.0.1:8000/api/recettes/";

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
    if (response.status != 201){
      alert("Une erreur est survenue. Merci de vérifier les valeurs renseignées ou de réessayer ultérieurement");
    } else {
      const result = await response.json();
      window.location.href = '/recettes/'+result.id
      setCategory(null);
      setModalOpen(false);
    }
  }else {
    alert("Merci de renseignez une catégorie pour cette nouvelle recette. Vous pourrez la modifier ultérieurement.")
  }
    
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
                   <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
          <label style={{ marginRight: "7px" }} htmlFor="categories">
            Catégorie:
          </label>
          <Select
            id="categories"
            className="flex-grow-1"
            options={category_options}
            placeholder="Sélectionner une catégorie"
            isSearchable={true}
            value={category}
            onChange={(data) => {
              setCategory(data);
            }}
          />
        </div>
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

export default CreateNewRecetteButton;
