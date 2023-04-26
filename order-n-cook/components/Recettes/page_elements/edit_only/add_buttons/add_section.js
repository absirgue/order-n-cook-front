import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { useSWRConfig } from "swr";

/*
A modal that shows all the Fournisseurs providing a given ingredient and gives the ability to order a selected
quantity of said ingredient from a selected provider.
*/
const AddSection = ({
  unused_sections,
  recette,
  set_section_options,
  all_sections,
  newly_imported_sections,
  set_newly_imported_sections,
  setAllUnusedSections,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [importExisting, setImportExisting] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState("");
  const [nameError, setNameError] = React.useState(null);
  const { mutate } = useSWRConfig();

  const get_unused_sections_options = () => {
    const section_options = [];
    console.log("UNUSED SECTIONS IN HERE");
    console.log(unused_sections);
    if (unused_sections) {
      console.log("UNUSED SECTIONS IN HERE");
      unused_sections.forEach((section) =>
        section_options.push({
          value: section.id,
          label: section.name,
          number: section.number,
        })
      );
    }
    return section_options;
  };

  const resetSelections = () => {
    setImportExisting(false);
    setSelectedSection("");
  };

  function reset_all_errors() {
    setNameError(null);
  }
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    if (!importExisting) {
      // Get data from the form.
      let data = {};
      if (event.target.section_name && event.target.section_name.value) {
        data["name"] = event.target.section_name.value;
      }

      let max_section_number = 0;
      for (let section_number of recette.sections.map(
        (section) => section.number
      )) {
        if (section_number > max_section_number) {
          max_section_number = section_number;
        }
      }
      data["number"] = max_section_number + 1;
      data["recette"] = recette.id;
      const JSONdata = JSON.stringify(data);

      // API endpoint where we send form data.
      const endpoint = `http://127.0.0.1:8000/api/recette_section/`;

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
        set_newly_imported_sections([...newly_imported_sections, data]);
        reset_all_errors();
        mutate(`http://127.0.0.1:8000/api/recettes/${recette.id}/`);
        setModalOpen(false);
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
    } else {
      const selected_section_assembled = {
        id: selectedSection.value,
        name: selectedSection.label,
        number: selectedSection.number,
      };
      set_section_options([...all_sections, selected_section_assembled]);
      set_newly_imported_sections([
        ...newly_imported_sections,
        selected_section_assembled,
      ]);
      setModalOpen(false);
    }

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
  };

  return (
    <>
      <Button
        className="btn btn-secondary mb-2 col-12"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Ajouter une section
      </Button>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className="modal-header">
          <h5 className="modal-title">Ajouter une section</h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            style={{ backgroundColor: "transparent", border: 0 }}
            onClick={() => {
              setModalOpen(!modalOpen);
              resetSelections();
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
            <div className="d-flex flex-column ">
              {unused_sections.length > 0 ? (
                <div className="d-flex flex-row justify-content-between col-12 align-items-baseline mb-4">
                  <Button
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      color: "black",
                      textDecoration: importExisting ? null : "underline",
                      textDecorationColor: importExisting ? null : "#086EFD",
                      textDecorationThickness: importExisting ? null : "3px",
                    }}
                    onClick={() => setImportExisting(false)}
                  >
                    Créer une nouvelle section
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      color: "black",
                      textDecoration: importExisting ? "underline" : null,
                      textDecorationColor: importExisting ? "#086EFD" : null,
                      textDecorationThickness: importExisting ? "3px" : null,
                    }}
                    onClick={() => setImportExisting(true)}
                  >
                    Ajouter une section existante
                  </Button>
                </div>
              ) : null}
              <div className="d-flex flex-column justify-content-start col-12 align-items-start">
                <div className="d-flex flex-row justify-content-start align-items-baseline col-12">
                  {importExisting ? (
                    <Select
                      className="col-11 mb-2"
                      options={get_unused_sections_options()}
                      placeholder="Choisir une section à ajouter"
                      isSearchable={true}
                      value={selectedSection}
                      onChange={(data) => setSelectedSection(data)}
                      required
                    />
                  ) : (
                    <input
                      className="col-11 mb-2"
                      type="text"
                      id="section_name"
                      name="section_name"
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
                  )}
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

export default AddSection;
