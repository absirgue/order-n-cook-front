import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import React from "react";
import Select from "react-select";

/**
 * This component enables moving an Ingredient or a Progression Element to another section.
 * @param {*} is_ingredient if the element targetted is an ingredient
 * @param {*} is_progression if the element targetted is a progression element
 * @param {*} element the element targetted
 * @param {*} all_sections all the sections we can possibly switch the targetted element to.
 */
const ChangeSectionButton = ({
  is_ingredient = false,
  is_progression = false,
  element,
  all_sections,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState("");

  function resetSelections() {
    setSelectedSection("");
  }
  const get_unused_sections_options = () => {
    console.log("ALL SECTIONS");
    console.log(all_sections);
    const sections = [];
    all_sections.map((section) => {
      if (section.number != element.section) {
        sections.push({
          value: section.id,
          label: section.name,
          number: section.number,
        });
      }
    });

    return sections;
  };

  const handleSubmit = async () => {
    console.log("ELEMENT");
    console.log(element);
    let endpoint = "http://127.0.0.1:8000/api/general/";
    if (is_ingredient) {
      endpoint += "recette_ingredients/";
    } else if (is_progression) {
      endpoint += "recette_progression/";
    }
    endpoint += element.id + "/";
    console.log("ENDPOINT");
    console.log(endpoint);
    // Form the request for sending data to the server.
    const data = { section: selectedSection.number };
    const JSONdata = JSON.stringify(data);
    const options = {
      // The method is POST because we are sending data.
      method: "PUT",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
      // Body of the request is the JSON data we created above.
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
      mutate(`http://127.0.0.1:8000/api/general/recettes/${recette_id}/`);
    } else {
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  };
  return (
    <>
      <Button
        className="emoji_button"
        title="Changer de section"
        onClick={() => setModalOpen(!modalOpen)}
      >
        🗂
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">
            Changer un{" "}
            {is_ingredient
              ? "ingrédient"
              : is_progression
              ? "élément de progression"
              : null}{" "}
            de section
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            style={{ backgroundColor: "transparent", border: 0 }}
            onClick={() => {
              resetSelections();
              setModalOpen(!modalOpen);
            }}
          >
            ×
          </button>
        </div>
        <form
          style={{ fontSize: "14px", marginBottom: "0px" }}
          onSubmit={handleSubmit}
        >
          <ModalBody className="pt-1">
            <Select
              className="col-11 mb-2"
              options={get_unused_sections_options()}
              placeholder="Choisir une section"
              isSearchable={true}
              value={selectedSection}
              onChange={(data) => setSelectedSection(data)}
              required
            />
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
            <Button
              className="btn-secondary"
              type="button"
              onClick={() => {
                resetSelections();
                setModalOpen(!modalOpen);
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
export default ChangeSectionButton;
