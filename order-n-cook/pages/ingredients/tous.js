import IngredientListItem from "../../components/Ingredients/Ingredients/page_elements/ingredients_list_item";
import React, { useState, useEffect } from "react";
import { Button, Table } from "reactstrap";
import Modal from "react-bootstrap/Modal";

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

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://127.0.0.1:8000/api/ingredients/`);
  let allIngredientsData = await res.json();
  allIngredientsData = allIngredientsData.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  // Pass data to the page via props
  return { props: { allIngredientsData } };
}

// The initial data needs to be grouped and sorted in alphabetical order so that this alphabetical order is
// kept across the differents groupings realised by the user.
function get_initial_data_grouped_and_sorted(allIngredientsData) {
  const grouped_default_data = allIngredientsData.reduce((group, product) => {
    const { name } = product;
    group[name[0]] = group[name[0]] ?? [];
    group[name[0]].push(product);
    return group;
  }, {});
  var default_data = [];

  for (var key in grouped_default_data) {
    if (grouped_default_data.hasOwnProperty(key)) {
      default_data.push({
        group_name: key,
        ingredients: grouped_default_data[key],
      });
    }
  }
  return default_data;
}

export default function AllIngredientsDisplay({ allIngredientsData }) {
  // State variable for the filtered search modal
  const [modalOpen, setModalOpen] = useState(false);

  // State variables for the storage of grouped and sorted data
  const [groupedData, setGroupedData] = useState(
    get_initial_data_grouped_and_sorted(allIngredientsData)
  );
  const [filteredData, setFilteredData] = useState(allIngredientsData);

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
    new Set(allIngredientsData.map((ingredient) => ingredient.category))
  );

  // Retrieve all the different labels to display in the filtered search.
  const all_different_labels = Array.from(
    new Set(
      allIngredientsData
        .map((ingredient) => ingredient.labels)
        .flat()
        .map((label) => label.name)
    )
  );

  // Retrieve all the different allergenes to display in the filtered search.
  const all_different_allergenes = Array.from(
    new Set(
      allIngredientsData
        .map((ingredient) => ingredient.allergenes)
        .flat()
        .map((allergene) => allergene.name)
    )
  );

  // Retrieve all the different sous categories to display in the filtered search.
  const all_different_sous_categories = Array.from(
    new Set(allIngredientsData.map((ingredient) => ingredient.sous_category))
  );

  // Group the filtered data according to a given field.
  function group_list_based_on_field(list, groupField) {
    return list.reduce((group, product) => {
      if (groupField == "name" || groupField == "default" || !groupField) {
        const { name } = product;
        group[name[0]] = group[name[0]] ?? [];
        group[name[0]].push(product);
        return group;
      } else if (groupField) {
        if (groupField == "category") {
          const { category } = product;
          group[category] = group[category] ?? [];
          group[category].push(product);
          return group;
        } else if (groupField == "sous_category") {
          const { sous_category } = product;
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
        dict_to_array.push({ group_name: key, ingredients: group_data[key] });
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
      var results = allIngredientsData;
      if (searchString != "") {
        results = results.filter((ingredient) => {
          if (searchString === "") return allIngredientsData;
          return ingredient.name
            .toLowerCase()
            .includes(searchString.toLowerCase());
        });
      }
      if (categoryFilter != "default") {
        results = results.filter(
          (ingredient) =>
            ingredient.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      if (labelFilter != "default") {
        results = results.filter((ingredient) =>
          ingredient.labels.map((label) => label.name).includes(labelFilter)
        );
      }
      if (allergeneFilter != "default") {
        results = results.filter((ingredient) =>
          ingredient.allergenes
            .map((allergene) => allergene.name)
            .includes(allergeneFilter)
        );
      }
      if (sousCategoryFilter != "default") {
        results = results.filter(
          (ingredient) =>
            ingredient.sous_category.toLowerCase() ===
            sousCategoryFilter.toLowerCase()
        );
      }
      if (monthFilter != "default") {
        results = results.filter(
          (ingredient) => ingredient.season[MONTHS.indexOf(monthFilter)] == true
        );
      }
      if (onlySeasonFilter) {
        const dateHelper = new Date();
        const current_month_number = dateHelper.getMonth();
        results = results.filter(
          (ingredient) => ingredient.season[current_month_number] == true
        );
      }
      groupIngredientData(results, groupingField);
      setFilteredData(results);
    }
    setModalOpen(!modalOpen);
  };

  return (
    <div className="col-12 col-lg-10">
      <div className={"d-flex flex-row m-1 mb-2"}>
        <div className={"col-5 d-flex flex-row justify-content-start"}>
          <Button
            className={"btn btn-primary col-6"}
            style={{ textAlign: "start" }}
            color="white"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            🔎 Recherche avancée
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
                    "d-flex flex-row col-12 justify-content-center align-items-center mb-1"
                  }
                >
                  <p
                    style={{ fontSize: 15, textAlign: "end" }}
                    className="col-4"
                  >
                    Par nom:
                  </p>
                  <input
                    className={"col-7 ps-2 black_placeholder ms-2"}
                    style={{
                      height: "38px",
                    }}
                    placeholder="Nom de l'ingrédient"
                    onChange={(e) => setSearchString(e.target.value)}
                    value={searchString}
                    type="search"
                  />
                </div>
                <div
                  className={
                    "d-flex flex-row col-12 justify-content-center align-items-center mb-1"
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
                    "d-flex flex-row col-12 justify-content-center align-items-center mb-1"
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
                    "d-flex flex-row col-12 justify-content-center align-items-center mb-1"
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
                    "d-flex flex-row col-12 justify-content-center align-items-center mb-1"
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
                    "d-flex flex-row col-12 justify-content-center align-items-center mb-1"
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
                    "d-flex flex-row col-12 justify-content-center align-items-center mb-1"
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
                    className=" ms-2 col-7"
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
        </div>
        <div className={"col-7 d-flex flex-row justify-content-end"}>
          <button
            className={"btn"}
            style={{ textDecorationLine: "underline", color: "#6C757D" }}
            onClick={() => {
              setGroupedData(
                get_initial_data_grouped_and_sorted(allIngredientsData)
              );
              setFilteredData(allIngredientsData);
              setGroupingField("default");
              resetSearchFilters();
            }}
          >
            Réinitialiser
          </button>
          <select
            className={"btn"}
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
              <p style={{ background: "#CDCCCD", paddingLeft: "10px" }}>
                {group.group_name}
              </p>
              <Table hover style={{ backgroundColor: "transparent" }}>
                <tbody>
                  {group.ingredients.map((ingredient) => (
                    <IngredientListItem
                      ingredient={ingredient}
                      key={ingredient.id}
                    ></IngredientListItem>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </div>
      ) : (
        <div className={"d-flex flex-row justify-content-center"}>
          <p>
            Aucun ingrédient ne correspond à cette recherche. Si vous n'avez pas
            effectué de recherche, merci de vérifier votre connexion internet
          </p>
        </div>
      )}
    </div>
  );
}
