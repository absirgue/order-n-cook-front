import React, { useRef, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { sendCreateNewRecette } from "../../../utils/backend/recette_requests";
import { get_all_existing_recette_categories } from "../../../utils/backend/recette_components_requests";
import AddRecetteTagButton from "./edit_only/add_buttons/add_recette_tag_button";
import useSWR from "swr";

function redirectToNewlyCreatedRecette(new_recette_id) {
  window.location.href = "/recettes/" + new_recette_id;
}

const fetcher = (url) => fetch(url).then((res) => res.json());
/**
 * A button and model to create a new recipe.
 */
const CreateNewRecetteButton = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [category, setCategory] = React.useState(null);

  const category_options = [];

  const { data: categoryData, error: categoryDataError } = useSWR(
    `http://127.0.0.1:8000/api/recette_categories/`,
    fetcher
  );

  const generate_option_list = async () => {
    categoryData.forEach((category) =>
      category_options.push({ value: category.name, label: category.name })
    );
  };

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

      const response = await sendCreateNewRecette(data);
      if (response.status != 201) {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées ou de réessayer ultérieurement"
        );
      } else {
        const result = await response.json();
        redirectToNewlyCreatedRecette(result.id);
        setCategory(null);
        setModalOpen(false);
      }
    } else {
      alert(
        "Merci de renseignez une catégorie pour cette nouvelle recette. Vous pourrez la modifier ultérieurement."
      );
    }
  };
  if (categoryDataError) {
    return (
      <div>
        Une erreur est survenue lors du chargement de la page. Si cette erreur
        persiste, contactez le service technique.
      </div>
    );
  }

  if (!categoryDataError && !categoryData)
    return <div>Chargement en cours ...</div>;
  generate_option_list();
  return (
    <>
      <Button
        className="btn btn-secondary"
        onClick={() => setModalOpen(!modalOpen)}
      >
        + Créer
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
                  placeholder="Nom de la nouvelle recette"
                  required
                />
                <div className="col-12 d-flex flew-row justify-content-between align-items-baseline mb-2">
                  <Select
                    id="categories"
                    className="flex-grow-1 col-10 me-2"
                    options={category_options}
                    placeholder="Sélectionner une catégorie"
                    isSearchable={true}
                    value={category}
                    onChange={(data) => {
                      setCategory(data);
                    }}
                  />
                  <AddRecetteTagButton is_category={true}></AddRecetteTagButton>
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
