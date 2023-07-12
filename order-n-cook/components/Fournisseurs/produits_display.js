import React, { useState, useEffect } from "react";
import { Button, Table } from "reactstrap";
import Modal from "react-bootstrap/Modal";

import ProduitListItem from "./produit_list_item";
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// The initial data needs to be grouped and sorted in alphabetical order so that this alphabetical order is
// kept across the differents groupings realised by the user.
function get_initial_data_grouped_and_sorted(fournisseurIngredientsData) {
  const grouped_default_data = fournisseurIngredientsData.reduce(
    (group, product) => {
      const { name } = product.ingredient;
      group[name[0]] = group[name[0]] ?? [];
      group[name[0]].push(product);
      return group;
    },
    {}
  );
  var default_data = [];

  for (var key in grouped_default_data) {
    if (grouped_default_data.hasOwnProperty(key)) {
      default_data.push({
        group_name: key,
        produits: grouped_default_data[key],
      });
    }
  }
  return default_data;
}

export default function FournisseurProduitsDisplay({
  fournisseurIngredientsData,
  fournisseur_name,
  fournisseur_id,
  isEdit = false,
  mutate = null,
}) {
  // State variable for the filtered search modal
  const [modalOpen, setModalOpen] = useState(false);

  // State variables for the storage of grouped and sorted data
  const [groupedData, setGroupedData] = useState(
    get_initial_data_grouped_and_sorted(fournisseurIngredientsData)
  );
  const [filteredData, setFilteredData] = useState(fournisseurIngredientsData);

  // State variables to handle the filtered search
  const [groupingField, setGroupingField] = useState("default");
  const [searchString, setSearchString] = useState("");
  const [allergeneFilter, setAllergeneFilter] = useState("default");
  const [sousCategoryFilter, setsousCategoryFilter] = useState("default");
  const [labelFilter, setLabelFilter] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("default");
  const [onlySeasonFilter, setOnlySeasonFilter] = useState(false);
  const [monthFilter, setMonthFilter] = useState("default");

  // Retrieve all the different categories to display in the filtered search.
  const all_different_categories = Array.from(
    new Set(
      fournisseurIngredientsData.map((produit) => produit.ingredient.category)
    )
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      filteredSearch();
    }
  };

  // Retrieve all the different labels to display in the filtered search.
  const all_different_labels = Array.from(
    new Set(
      fournisseurIngredientsData
        .filter((produit) => produit.ingredient.labels != null)
        .map((produit) => produit.ingredient.labels)
        .flat()
        .map((label) => {
          return label.name;
        })
    )
  );

  // Retrieve all the different allergenes to display in the filtered search.
  const all_different_allergenes = Array.from(
    new Set(
      fournisseurIngredientsData
        .filter((produit) => produit.ingredient.allergenes != null)
        .map((produit) => produit.ingredient.allergenes)
        .flat()
        .map((allergene) => allergene.name)
    )
  );

  // Retrieve all the different sous categories to display in the filtered search.
  const all_different_sous_categories = Array.from(
    new Set(
      fournisseurIngredientsData.map(
        (produit) => produit.ingredient.sous_category
      )
    )
  );

  // Group the filtered data according to a given field.
  function group_list_based_on_field(list, groupField) {
    return list.reduce((group, product) => {
      if (groupField == "name" || groupField == "default" || !groupField) {
        const { name } = product.ingredient;
        group[name[0]] = group[name[0]] ?? [];
        group[name[0]].push(product);
        return group;
      } else if (groupField) {
        if (groupField == "category") {
          const { category } = product.ingredient;
          group[category] = group[category] ?? [];
          group[category].push(product);
          return group;
        } else if (groupField == "sous_category") {
          const { sous_category } = product.ingredient;
          group[sous_category] = group[sous_category] ?? [];
          group[sous_category].push(product);
          return group;
        }
      }
    }, {});
  }

  // Sort the groups alphabetically.
  function get_sorted_and_cleaned_groups_data(group_data) {
    var dict_to_array = [];

    for (var key in group_data) {
      if (group_data.hasOwnProperty(key)) {
        dict_to_array.push({ group_name: key, produits: group_data[key] });
      }
    }
    return dict_to_array.sort(function (a, b) {
      if (a.group_name < b.group_name) {
        return -1;
      }
      if (a.group_name > b.group_name) {
        return 1;
      }
      return 0;
    });
  }

  // Helper to combine the two grouping operations
  const groupIngredientData = (dataToFilter, groupField) => {
    const groupedIngredients = group_list_based_on_field(
      dataToFilter,
      groupField
    );
    const sorted_and_cleaned_groups_data =
      get_sorted_and_cleaned_groups_data(groupedIngredients);
    setGroupedData(sorted_and_cleaned_groups_data);
  };

  // Reset all search filters to their default values.
  const resetSearchFilters = () => {
    setSearchString("");
    setAllergeneFilter("default");
    setCategoryFilter("default");
    setLabelFilter("default");
    setsousCategoryFilter("default");
    setMonthFilter("default");
    setOnlySeasonFilter(false);
  };

  // Perform a filtered search based on the various filters inputted by the user.
  const filteredSearch = () => {
    if (
      searchString != "" ||
      categoryFilter != "default" ||
      labelFilter != "default" ||
      allergeneFilter != "default" ||
      sousCategoryFilter != "default" ||
      monthFilter != "default" ||
      onlySeasonFilter
    ) {
      var results = fournisseurIngredientsData;
      if (searchString != "") {
        results = results.filter((produit) => {
          if (searchString === "") return fournisseurIngredientsData;
          return produit.ingredient.name
            .toLowerCase()
            .includes(searchString.toLowerCase());
        });
      }
      if (categoryFilter != "default") {
        results = results.filter(
          (produit) =>
            produit.ingredient.category.toLowerCase() ===
            categoryFilter.toLowerCase()
        );
      }
      if (labelFilter != "default") {
        results = results.filter((produit) => {
          if (produit.ingredient.labels) {
            return produit.ingredient.labels
              .map((label) => label.name)
              .includes(labelFilter);
          } else {
            return false;
          }
        });
      }
      if (allergeneFilter != "default") {
        results = results.filter((produit) => {
          if (produit.ingredient.allergenes) {
            return produit.ingredient.allergenes
              .map((allergene) => allergene.name)
              .includes(allergeneFilter);
          } else {
            return false;
          }
        });
      }
      if (sousCategoryFilter != "default") {
        results = results.filter(
          (produit) =>
            produit.ingredient.sous_category.toLowerCase() ===
            sousCategoryFilter.toLowerCase()
        );
      }
      if (monthFilter != "default") {
        results = results.filter(
          (produit) =>
            produit.ingredient.season[MONTHS.indexOf(monthFilter)] == true
        );
      }
      if (onlySeasonFilter) {
        const dateHelper = new Date();
        const current_month_number = dateHelper.getMonth();
        results = results.filter(
          (produit) => produit.ingredient.season[current_month_number] == true
        );
      }
      groupIngredientData(results, groupingField);
      setFilteredData(results);
    }
    setModalOpen(false);
  };

  return (
    <div className="col-11 col-lg-10">
      <div className={"d-flex flex-row m-1 mb-1 justify-content-between"}>
        <div
          className={
            "d-flex flex-row col-4 justify-content-between align-items-center"
          }
        >
          <input
            className={"col-9 ps-2 me-2 flex-grow-1 search_bar"}
            style={{
              height: "38px",
              marginBottom: "0px",
            }}
            placeholder="Rechercher par nom de produit"
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={handleKeyDown}
            value={searchString}
            type="search"
          />
          <Button
            color="primary"
            type="button"
            className="col-2"
            onClick={() => filteredSearch()}
          >
            Valider
          </Button>
        </div>

        <div className={"col-7 d-flex flex-row justify-content-end"}>
          <button
            className={"btn"}
            style={{ textDecorationLine: "underline", color: "#6C757D" }}
            onClick={() => {
              setGroupedData(
                get_initial_data_grouped_and_sorted(fournisseurIngredientsData)
              );
              setFilteredData(fournisseurIngredientsData);
              setGroupingField("default");
              resetSearchFilters();
            }}
          >
            Réinitialiser
          </button>

          <Button
            className={"btn btn-secondary ms-2"}
            style={{ textAlign: "center" }}
            color="white"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            Filtrer
          </Button>
          <Modal
            size="lg"
            show={modalOpen}
            onHide={() => setModalOpen(!modalOpen)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <div className=" modal-header d-flex flex-row justify-content-end">
              <Button type="button" onClick={() => setModalOpen(!modalOpen)}>
                Fermer
              </Button>
            </div>
            <Modal.Body>
              <form className={"d-flex flex-column"}>
                <div
                  className={
                    "d-flex flex-row align-items-center col-12 justify-content-center mb-1"
                  }
                >
                  <p
                    style={{ fontSize: 15, textAlign: "end" }}
                    className="col-4"
                  >
                    Par catégorie:
                  </p>
                  <select
                    className={"col-7 ps-1 ms-2"}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                    }}
                    value={categoryFilter}
                  >
                    <option disabled value="default">
                      Nom de la catégorie
                    </option>
                    {all_different_categories.map((category) => (
                      <option value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    "d-flex flex-row align-items-center col-12 justify-content-center mb-1"
                  }
                >
                  <p
                    style={{ fontSize: 15, textAlign: "end" }}
                    className="col-4"
                  >
                    Par allergène:
                  </p>
                  <select
                    className={"col-7 ps-1 ms-2"}
                    onChange={(e) => {
                      setAllergeneFilter(e.target.value);
                    }}
                    value={allergeneFilter}
                  >
                    <option disabled value="default">
                      Nom de l'allergène
                    </option>
                    {all_different_allergenes.map((allergene) => (
                      <option value={allergene}>{allergene}</option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    "d-flex flex-row align-items-center col-12 justify-content-center mb-1"
                  }
                >
                  <p
                    style={{ fontSize: 15, textAlign: "end" }}
                    className="col-4"
                  >
                    Par label:
                  </p>
                  <select
                    className={"col-7 ps-1 ms-2"}
                    onChange={(e) => {
                      setLabelFilter(e.target.value);
                    }}
                    value={labelFilter}
                  >
                    <option disabled value="default">
                      Nom du label
                    </option>
                    {all_different_labels.map((label) => (
                      <option value={label}>{label}</option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    "d-flex flex-row align-items-center col-12 justify-content-center mb-1"
                  }
                >
                  <p
                    style={{ fontSize: 15, textAlign: "end" }}
                    className="col-4"
                  >
                    Par sous catégorie:
                  </p>
                  <select
                    className={"col-7 ps-1 ms-2"}
                    onChange={(e) => {
                      setsousCategoryFilter(e.target.value);
                    }}
                    value={sousCategoryFilter}
                  >
                    <option disabled value="default">
                      Nom de la sous catégorie
                    </option>
                    {all_different_sous_categories.map((label) => (
                      <option value={label}>{label}</option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    "d-flex flex-row align-items-center col-12 justify-content-center mb-1"
                  }
                >
                  <p
                    style={{ fontSize: 15, textAlign: "end" }}
                    className="col-4"
                  >
                    Par mois de saisonnalité:
                  </p>
                  <select
                    className={"col-7 ps-1 ms-2"}
                    onChange={(e) => {
                      setMonthFilter(e.target.value);
                    }}
                    value={monthFilter}
                  >
                    <option disabled value="default">
                      Nom du mois
                    </option>
                    {MONTHS.map((mois) => (
                      <option value={mois}>{mois}</option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    "d-flex flex-row align-items-center col-12 justify-content-center mb-1"
                  }
                >
                  <div className="col-4 justify-content-end d-flex flex-row">
                    {onlySeasonFilter ? (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setOnlySeasonFilter(false)}
                        checked
                      />
                    ) : (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setOnlySeasonFilter(true)}
                      />
                    )}
                  </div>
                  <p
                    style={{ fontSize: 15, textAlign: "start" }}
                    className="col-7 ms-2"
                  >
                    Seulement les produits actuellement de saison
                  </p>
                </div>

                <div className="d-flex flex-row justify-content-end col-12">
                  <button
                    className={"btn"}
                    style={{
                      textDecorationLine: "underline",
                      color: "#95929c",
                    }}
                    onClick={() => resetSearchFilters()}
                  >
                    Réinitialiser les critères
                  </button>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                color="primary"
                type="button"
                className="col-4"
                onClick={() => filteredSearch()}
              >
                Rechercher
              </Button>
            </Modal.Footer>
          </Modal>

          <select
            className={"btn"}
            style={{ textAlign: "start" }}
            onChange={(e) => {
              setGroupingField(e.target.value);
              groupIngredientData(filteredData, e.target.value);
            }}
            value={groupingField}
          >
            <option disabled value="default">
              Trier
            </option>
            <option value="name">Par nom</option>
            <option value="category">Par catégorie</option>
            <option value="sous_category">Par sous catégorie</option>
          </select>
        </div>
      </div>
      {groupedData.length > 0 ? (
        <div>
          {groupedData.map((group) => (
            <div>
              <p
                style={{ background: "#CDCCCD", paddingLeft: "10px" }}
                className="mb-2"
              >
                {group.group_name}
              </p>
              <Table
                hover
                className="mb-2"
                style={{ backgroundColor: "transparent" }}
              >
                <tbody>
                  {group.produits.map((produit) => (
                    <ProduitListItem
                      produit={produit}
                      fournisseur_id={fournisseur_id}
                      isEdit={isEdit}
                      fournisseur_name={fournisseur_name}
                      mutate={mutate}
                    ></ProduitListItem>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </div>
      ) : (
        <div className={"d-flex flex-row justify-content-center"}>
          <p>
            Aucun produit de ce fournisseur ne correspond à cette recherche. Si
            vous n'avez pas effectué de recherche, merci de vérifier votre
            connexion internet
          </p>
        </div>
      )}
    </div>
  );
}
