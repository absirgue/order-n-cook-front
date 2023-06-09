import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { get_data_object_for_fournisseur_fiche_contact_update_event } from "./helpers/general_fournisseur";
import { useSWRConfig } from "swr";

async function send_update_fiche_contact(data, fournisseur) {
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = `http://127.0.0.1:8000/api/fournisseurs/${fournisseur.id}/`;

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
  return response;
}
export default function FicheContact({ fournisseurData }) {
  const [ficheContactShow, setFicheContactShow] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [errors, setErrors] = useState({});
  const { mutate } = useSWRConfig();

  const ADRESSE_FIELDS = [
    { name: "address", tag: "Adresse", default_value: fournisseurData.address },
    {
      name: "address_line_2",
      tag: "Adresse (suite)",
      default_value: fournisseurData.address_line_2,
    },
    {
      name: "postal_code",
      tag: "Code postal",
      default_value: fournisseurData.postal_code,
    },
    { name: "country", tag: "Pays", default_value: fournisseurData.country },
    { name: "city", tag: "Ville", default_value: fournisseurData.city },
    {
      name: "department",
      tag: "Département",
      default_value: fournisseurData.department,
    },
  ];

  const PHONE_FIELDS = [
    {
      name: "ordering_phone_number",
      tag: "Téléphone de commande",
      default_value: fournisseurData.ordering_phone_number,
    },
    {
      name: "principal_phone_number",
      tag: "Téléphone principal",
      default_value: fournisseurData.principal_phone_number,
    },

    {
      name: "accounting_phone_number",
      tag: "Téléphone comptabilité",
      default_value: fournisseurData.accounting_phone_number,
    },
  ];

  const EMAIL_FIELDS = [
    {
      name: "ordering_email",
      tag: "Email de commande",
      default_value: fournisseurData.ordering_email,
    },
    {
      name: "principal_email",
      tag: "Email principal",
      default_value: fournisseurData.principal_email,
    },
    {
      name: "cc_sales_email",
      tag: "Email du commercial",
      default_value: fournisseurData.cc_sales_email,
    },
  ];

  const CLIENT_CODE_FIELD = [
    {
      name: "client_code",
      tag: "Code client",
      default_value: fournisseurData.client_code,
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Stop the form from submitting and refreshing the page.
    const data = get_data_object_for_fournisseur_fiche_contact_update_event(
      event.target,
      fournisseurData
    );

    const response = await send_update_fiche_contact(data, fournisseurData);
    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.

    if (response.status == 200) {
      mutate(`http://127.0.0.1:8000/api/fournisseurs/${fournisseurData.id}/`);
      setIsModify(false);
      setErrors({});
    } else {
      const result = await response.json();
      let error_found = false;
      const all_fields = ADRESSE_FIELDS.concat(
        EMAIL_FIELDS,
        PHONE_FIELDS,
        CLIENT_CODE_FIELD
      );

      all_fields.forEach((field) => {
        if (result.hasOwnProperty(field.name)) {
          error_found = true;
        }
      });

      if (error_found) {
        setErrors(result);
      } else {
        alert(
          "Une erreur est survenue. Merci de vérifier les valeurs renseignées ou de réessayer utlérieurement."
        );
      }
    }
  };

  function closeModal() {
    setFicheContactShow(false);
    setIsModify(false);
  }

  return (
    <>
      <Button
        className="btn btn-primary"
        onClick={() => {
          setFicheContactShow(true);
        }}
      >
        Fiche Contact
      </Button>
      <Modal
        size="lg"
        show={ficheContactShow}
        onHide={() => closeModal()}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <form className="col-12" onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <div className="d-flex flex-row justify-content-between col-11 align-items-end">
              <Modal.Title id="example-modal-sizes-title-lg">
                Fiche Contact pour {fournisseurData.name}
              </Modal.Title>
              {isModify ? null : (
                <Button onClick={() => setIsModify(!isModify)}>Modifier</Button>
              )}
            </div>
          </Modal.Header>

          <Modal.Body>
            <div className="col-12 p-2 d-flex flex-row justify-content-between flex-wrap">
              {isModify ? (
                <>
                  <div className="col-6 ps-1 d-flex flex-column">
                    {EMAIL_FIELDS.map((field) => (
                      <>
                        <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mb-1 align-items-center">
                          <label
                            className="col-5"
                            style={{ textAlign: "end" }}
                            htmlFor={field.name}
                          >
                            {field.tag}:
                          </label>
                          <input
                            type="text"
                            className="ms-1 col-7 input-fiche-contact"
                            id={field.name}
                            name={field.name}
                            defaultValue={
                              field.default_value ? field.default_value : null
                            }
                            placeholder={
                              field.default_value
                                ? field.default_value
                                : "inconnu"
                            }
                          />
                        </div>
                        {errors.hasOwnProperty(field.name) ? (
                          <p style={{ color: "red" }}>{errors[field.name]}</p>
                        ) : null}
                      </>
                    ))}
                    <div className="mb-3"></div>
                    {PHONE_FIELDS.map((field) => (
                      <>
                        <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mb-1 align-items-center">
                          <label
                            className="col-5"
                            style={{ textAlign: "end" }}
                            htmlFor={field.name}
                          >
                            {field.tag}:
                          </label>
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            defaultValue={
                              field.default_value ? field.default_value : null
                            }
                            className="ms-1 col-7 input-fiche-contact"
                            placeholder={
                              field.default_value
                                ? field.default_value
                                : "inconnu"
                            }
                          />
                        </div>
                        {errors.hasOwnProperty(field.name) ? (
                          <p style={{ color: "red" }}>{errors[field.name]}</p>
                        ) : null}
                      </>
                    ))}
                  </div>
                  <div className="col-6 pe-1 d-flex flex-column">
                    {ADRESSE_FIELDS.map((field) => (
                      <>
                        <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mb-1 align-items-center">
                          <label
                            className="col-5"
                            style={{ textAlign: "end" }}
                            htmlFor={field.name}
                          >
                            {field.tag}:
                          </label>
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            defaultValue={
                              field.default_value ? field.default_value : null
                            }
                            className="ms-1 col-7 input-fiche-contact"
                            placeholder={
                              field.default_value
                                ? field.default_value
                                : "inconnu"
                            }
                          />
                        </div>
                        {errors.hasOwnProperty(field.name) ? (
                          <p style={{ color: "red" }}>{errors[field.name]}</p>
                        ) : null}
                      </>
                    ))}
                    <div className="mb-3"></div>
                    {CLIENT_CODE_FIELD.map((field) => (
                      <>
                        <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mb-1 align-items-center">
                          <label
                            className="col-5"
                            style={{ textAlign: "end" }}
                            htmlFor={field.name}
                          >
                            {field.tag}:
                          </label>
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            defaultValue={
                              field.default_value ? field.default_value : null
                            }
                            className="ms-1 col-7 input-fiche-contact"
                            placeholder={
                              field.default_value
                                ? field.default_value
                                : "inconnu"
                            }
                          />
                        </div>
                        {errors.hasOwnProperty(field.name) ? (
                          <p style={{ color: "red" }}>{errors[field.name]}</p>
                        ) : null}
                      </>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-7 ps-1 d-flex flex-column">
                    {fournisseurData.ordering_email ? (
                      <div
                        className="col-12 d-flex flex-row justify-content-center"
                        style={{ fontWeight: 600 }}
                      >
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          {" "}
                          Email commande:
                        </p>
                        <p className="greyed-label col-7 ms-1">
                          {" "}
                          {fournisseurData.ordering_email}
                        </p>
                      </div>
                    ) : fournisseurData.ordering_phone_number ? (
                      <p className="red-label">
                        Email de commande non su, les commandes ne pourront pas
                        être passée automatiquement.
                      </p>
                    ) : (
                      <p className="red-label">
                        Il est préférable de renseigner une adresse email ou un
                        numéro de téléphone destiné au passage de commande.
                      </p>
                    )}
                    {fournisseurData.principal_email ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          {" "}
                          Email principal:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.principal_email}
                        </p>
                      </div>
                    ) : null}
                    {fournisseurData.cc_sales_email ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          En copie commercial:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.cc_sales_email}
                        </p>
                      </div>
                    ) : null}
                    <div className="mb-3"></div>
                    {fournisseurData.ordering_phone_number ? (
                      <div
                        className="col-12 d-flex flex-row justify-content-center align-items-center"
                        style={{ fontWeight: 600 }}
                      >
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Téléphone commande:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.ordering_phone_number}
                        </p>
                      </div>
                    ) : null}
                    {fournisseurData.principal_phone_number ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Téléphone principal:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.principal_phone_number}
                        </p>
                      </div>
                    ) : null}
                    {fournisseurData.accounting_phone_number ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Téléphone comptabilité:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.accounting_phone_number}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div className="col-5 pe-1 d-flex flex-column">
                    {fournisseurData.address ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Adresse:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.address}
                        </p>
                      </div>
                    ) : null}
                    {fournisseurData.address_line_2 ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Adresse (suite):
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.address_line_2}
                        </p>
                      </div>
                    ) : null}
                    {fournisseurData.postal_code ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Code postal:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.postal_code}
                        </p>
                      </div>
                    ) : null}
                    {fournisseurData.city ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Ville:
                        </p>
                        <p className=" col-7 ms-1"> {fournisseurData.city}</p>
                      </div>
                    ) : null}
                    {fournisseurData.department ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Département:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.department}
                        </p>
                      </div>
                    ) : null}
                    {fournisseurData.country ? (
                      <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Pays:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.country}
                        </p>
                      </div>
                    ) : null}

                    {fournisseurData.client_code ? (
                      <div
                        className="mt-3 col-12 d-flex flex-row justify-content-center align-items-center"
                        style={{ fontWeight: 600 }}
                      >
                        <p
                          className="greyed-label col-5"
                          style={{ textAlign: "end" }}
                        >
                          Code client:
                        </p>
                        <p className=" col-7 ms-1">
                          {" "}
                          {fournisseurData.client_code}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </Modal.Body>
          {isModify ? (
            <Modal.Footer>
              <div className="col-12 d-flex flex-row justify-content-end">
                <Button
                  onClick={() => {
                    setIsModify(false);
                  }}
                >
                  Annuler
                </Button>

                <button className="ms-3 btn btn-primary" type="submit">
                  Enregistrer
                </button>
              </div>
            </Modal.Footer>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
