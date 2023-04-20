import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import React from "react";
import Select from "react-select";

const ChangeSectionButton = ({
  is_ingredient = false,
  is_progression = false,
  element,
  all_sections,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState("");
  const get_unused_sections_options = () => {
    const sections = [];
    all_sections.map((section) => {
      if (section.number != element.section) {
        sections.push({
          value: section.id,
          label: section.name,
        });
      }
    });

    return sections;
  };

  const handleSubmit = () => {
    if (selectedSection) {
      alert("Move to " + selectedSection);
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
              setModalOpen(!modalOpen);
            }}
          >
            ×
          </button>
        </div>
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
          <Button
            className="btn btn-primary"
            type="submit"
            onClick={() => handleSubmit()}
          >
            Enregistrer
          </Button>
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
      </Modal>
    </>
  );
};
export default ChangeSectionButton;
