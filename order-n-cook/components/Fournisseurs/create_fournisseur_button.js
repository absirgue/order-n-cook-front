import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { sendCreateNewFournisseur } from "../../utils/backend/fournisseur_requests";
import { get_all_existing_fournisseur_categories } from "../../utils/backend/fournisseur_requests";
import AddFournisseurTagButton from "./edit_only/granular/add_fournisseur_tag";

function redirectToNewlyCreatedFournisseur(new_fournisseur_id) {
  window.location.href = "/fournisseurs/" + new_fournisseur_id;
}

/**
 * A button and model to create a new fournisseur.
 */
const CreateNewFournisseurButton = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [category, setCategory] = React.useState(null);

  const category_options = [];

  const generate_option_list = async () => {
    const all_existing_fournisseur_categories =
      await get_all_existing_fournisseur_categories();
    all_existing_fournisseur_categories.forEach((category) =>
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
    if (category != null) {
      data["category"] = category.value;

      const response = await sendCreateNewFournisseur(data);
      if (response.status != 201) {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées ou de réessayer ultérieurement"
        );
      } else {
        const result = await response.json();
        redirectToNewlyCreatedFournisseur(result.id);
        setCategory(null);
        setModalOpen(false);
      }
    } else {
      alert(
        "Merci de renseignez une catégorie pour ce nouveau fournisseur. Vous pourrez la modifier ultérieurement."
      );
    }
  };

  return (
    <>
      <Button className="emoji_button" onClick={() => setModalOpen(!modalOpen)}>
        ➕
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">Créer un nouveau fournisseur</h5>
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
                  placeholder="Nom du nouveau fournisseur"
                  required
                />
                <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
                  <label style={{ marginRight: "7px" }} htmlFor="categories">
                    Catégorie:
                  </label>
                  <Select
                    id="categories"
                    className="flex-grow-1 me-1"
                    options={category_options}
                    placeholder="Sélectionner une catégorie"
                    isSearchable={true}
                    value={category}
                    onChange={(data) => {
                      setCategory(data);
                    }}
                  />
                  <AddFournisseurTagButton
                    is_category={true}
                  ></AddFournisseurTagButton>
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

export default CreateNewFournisseurButton;
