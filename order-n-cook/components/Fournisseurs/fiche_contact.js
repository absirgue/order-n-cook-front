import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

export default function FicheContact({ fournisseurData }) {
  const [ficheContactShow, setFicheContactShow] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [newDataInputted, set_new_data_inputted] = useState(false);

  function closeModal() {
    setFicheContactShow(false);
    setIsModify(false);
    set_new_data_inputted(false);
  }

  return (
    <>
      <Button
        className="btn btn-primary"
        onClick={() => {
          setFicheContactShow(true);
          console.log("FICHE CONTACT SHOW");
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
          <div className="col-12 p-2 d-flex flex-row justify-content-between">
            {isModify ? (
              <>
                <div className="col-6 ps-1 d-flex flex-column">
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12">
                    <label htmlFor="ordering_email">Email commande:</label>
                    <input
                      type="text"
                      id="ordering_email"
                      name="ordering_email"
                      defaultValue={
                        fournisseurData.ordering_email
                          ? fournisseurData.ordering_email
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.ordering_email
                          ? fournisseurData.ordering_email
                          : "order@n-cook.com"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="principal_email">Email principal:</label>
                    <input
                      type="text"
                      id="principal_email"
                      name="principal_email"
                      defaultValue={
                        fournisseurData.principal_email
                          ? fournisseurData.principal_email
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.principal_email
                          ? fournisseurData.principal_email
                          : "principal@order-n-cook.com"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="cc_sales_email">En copie commercial:</label>
                    <input
                      type="text"
                      id="cc_sales_email"
                      name="cc_sales_email"
                      defaultValue={
                        fournisseurData.cc_sales_email
                          ? fournisseurData.cc_sales_email
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.cc_sales_email
                          ? fournisseurData.cc_sales_email
                          : "copie_commercial@order-n-cook.com"
                      }
                    ></input>
                  </div>
                  <div className="mb-3"></div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="ordering_phone_number">
                      Téléphone commande:
                    </label>
                    <input
                      type="text"
                      id="ordering_phone_number"
                      name="ordering_phone_number"
                      defaultValue={
                        fournisseurData.ordering_phone_number
                          ? fournisseurData.ordering_phone_number
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.ordering_phone_number
                          ? fournisseurData.ordering_phone_number
                          : "inconnu"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="principal_phone_number">
                      Téléphone principal:
                    </label>
                    <input
                      type="text"
                      id="principal_phone_number"
                      name="principal_phone_number"
                      defaultValue={
                        fournisseurData.principal_phone_number
                          ? fournisseurData.principal_phone_number
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.principal_phone_number
                          ? fournisseurData.principal_phone_number
                          : "inconnu"
                      }
                    ></input>
                  </div>

                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="accounting_phone_number">
                      Téléphone comptabilité:
                    </label>
                    <input
                      type="text"
                      id="accounting_phone_number"
                      name="accounting_phone_number"
                      defaultValue={
                        fournisseurData.accounting_phone_number
                          ? fournisseurData.accounting_phone_number
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.accounting_phone_number
                          ? fournisseurData.accounting_phone_number
                          : "inconnu"
                      }
                    ></input>
                  </div>
                </div>
                <div className="col-6 pe-1 d-flex flex-column">
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="address">Adresse:</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      defaultValue={
                        fournisseurData.address ? fournisseurData.address : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.address
                          ? fournisseurData.address
                          : "inconnu"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="address_line_2">Adresse (suite):</label>
                    <input
                      type="text"
                      id="address_line_2"
                      name="address_line_2"
                      defaultValue={
                        fournisseurData.address_line_2
                          ? fournisseurData.address_line_2
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.address_line_2
                          ? fournisseurData.address_line_2
                          : "inconnu"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="postal_code">Code postal:</label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      defaultValue={
                        fournisseurData.postal_code
                          ? fournisseurData.postal_code
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.postal_code
                          ? fournisseurData.postal_code
                          : "inconnu"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="city">Ville:</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      defaultValue={
                        fournisseurData.city ? fournisseurData.city : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.city ? fournisseurData.city : "inconnu"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="department">Département:</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      defaultValue={
                        fournisseurData.department
                          ? fournisseurData.department
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.department
                          ? fournisseurData.department
                          : "inconnu"
                      }
                    ></input>
                  </div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="country">Pays:</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      defaultValue={
                        fournisseurData.country ? fournisseurData.country : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.country
                          ? fournisseurData.country
                          : "inconnu"
                      }
                    ></input>
                  </div>

                  <div className="mb-3"></div>
                  <div className="d-flex flex-row justify-content-start flex-wrap-1 col-12 mt-2">
                    <label htmlFor="client_code">Code client:</label>
                    <input
                      type="text"
                      id="client_code"
                      name="client_code"
                      defaultValue={
                        fournisseurData.client_code
                          ? fournisseurData.client_code
                          : null
                      }
                      onChange={() => set_new_data_inputted(true)}
                      className="input-fiche-contact"
                      placeholder={
                        fournisseurData.client_code
                          ? fournisseurData.client_code
                          : "inconnu"
                      }
                    ></input>
                  </div>
                </div>{" "}
              </>
            ) : (
              <>
                <div className="col-6 ps-1 d-flex flex-column">
                  {fournisseurData.ordering_email ? (
                    <p style={{ fontWeight: 600 }}>
                      <span className="greyed-label">Email commande: </span>
                      {fournisseurData.ordering_email}
                    </p>
                  ) : (
                    <p className="red-label">
                      Email de commande non su, les commandes ne pourront pas
                      être passée automatiquement.
                    </p>
                  )}
                  {fournisseurData.principal_email ? (
                    <p>
                      <span className="greyed-label">Email principal: </span>
                      {fournisseurData.principal_email}
                    </p>
                  ) : null}
                  {fournisseurData.cc_sales_email ? (
                    <p>
                      <span className="greyed-label">
                        En copie commercial:{" "}
                      </span>
                      {fournisseurData.cc_sales_email}
                    </p>
                  ) : null}
                  <div className="mb-3"></div>
                  {fournisseurData.ordering_phone_number ? (
                    <p style={{ fontWeight: 600 }}>
                      <span className="greyed-label">Téléphone commande: </span>
                      {fournisseurData.ordering_phone_number}
                    </p>
                  ) : fournisseurData.ordering_email ? null : (
                    <p className="red-label">
                      Il est préférable de renseigner une adresse email ou un
                      numéro de téléphone destiné au passage de commande.
                    </p>
                  )}
                  {fournisseurData.principal_phone_number ? (
                    <p>
                      <span className="greyed-label">
                        Téléphone principal:{" "}
                      </span>
                      {fournisseurData.principal_phone_number}
                    </p>
                  ) : null}
                  {fournisseurData.accounting_phone_number ? (
                    <p>
                      <span className="greyed-label">
                        Téléphone comptabilité:{" "}
                      </span>
                      {fournisseurData.accounting_phone_number}
                    </p>
                  ) : null}
                </div>
                <div className="col-6 pe-1 d-flex flex-column">
                  <p>
                    <span className="greyed-label">Adresse: </span>
                    {fournisseurData.address}
                  </p>
                  {fournisseurData.address_line_2 ? (
                    <p>
                      <span className="greyed-label">Adresse (suite): </span>
                      {fournisseurData.address_line_2}
                    </p>
                  ) : null}
                  {fournisseurData.postal_code ? (
                    <p>
                      <span className="greyed-label">Code postal: </span>
                      {fournisseurData.postal_code}
                    </p>
                  ) : null}
                  {fournisseurData.city ? (
                    <p>
                      <span className="greyed-label">Ville: </span>
                      {fournisseurData.city}
                    </p>
                  ) : null}
                  {fournisseurData.department ? (
                    <p>
                      <span className="greyed-label">Département: </span>
                      {fournisseurData.department}
                    </p>
                  ) : null}
                  {fournisseurData.country ? (
                    <p>
                      <span className="greyed-label">Pays: </span>
                      {fournisseurData.country}
                    </p>
                  ) : null}
                  <div className="mb-3"></div>
                  {fournisseurData.client_code ? (
                    <p style={{ fontWeight: 600 }}>
                      <span className="greyed-label">Code client: </span>
                      {fournisseurData.client_code}
                    </p>
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
                  set_new_data_inputted(false);
                }}
              >
                Annuler
              </Button>
              {newDataInputted ? (
                <Button className="btn btn-primary ms-3">Enregistrer</Button>
              ) : null}
            </div>
          </Modal.Footer>
        ) : null}
      </Modal>
    </>
  );
}
