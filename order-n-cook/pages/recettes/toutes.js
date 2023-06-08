import RecetteListItem from "../../components/Recettes/page_elements/list_items/recette_list_item";
import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, Table } from "reactstrap";
import Link from "next/link";
import CreateNewRecetteButton from "../../components/Recettes/page_elements/create_new_recette_modal";

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
  const res = await fetch(`http://127.0.0.1:8000/api/recettes/`);
  let allRecettesData = await res.json();
  allRecettesData = allRecettesData.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  // Pass data to the page via props
  return { props: { allRecettesData } };
}

// The initial data needs to be grouped and sorted in alphabetical order so that this alphabetical order is
// kept across the differents groupings realised by the user.
function get_initial_data_grouped_and_sorted(allRecettesData) {
  const grouped_default_data = allRecettesData.reduce((group, recette) => {
    const { category } = recette;
    group[category] = group[category] ?? [];
    group[category].push(recette);
    return group;
  }, {});
  var default_data = [];

  for (var key in grouped_default_data) {
    if (grouped_default_data.hasOwnProperty(key)) {
      default_data.push({
        group_name: key,
        recettes: grouped_default_data[key],
      });
    }
  }
  return default_data;
}

export default function AllRecettesDisplay({ allRecettesData }) {
  // State variable for the filtered search modal
  const [modalOpen, setModalOpen] = useState(false);

  // State variables for the storage of grouped and sorted data
  const [groupedData, setGroupedData] = useState(
    get_initial_data_grouped_and_sorted(allRecettesData)
  );
  const [filteredData, setFilteredData] = useState(allRecettesData);

  // State variables to handle the filtered search
  const [groupingField, setGroupingField] = useState("default");
  const [searchString, setSearchString] = useState("");
  const [tasteFilter, setTasteFilter] = useState("default");
  const [genreFilter, setGenreFilter] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("default");
  const [onTheMenuFilter, setOnTheMenuFilter] = useState(false);
  const [monthFilter, setMonthFilter] = useState("default");
  const [onNextMenuFilter, setOnNextMenuFilter] = useState(false);
  const [toModifyFilter, setToModifyFilter] = useState(false);

  //   const [onlySeasonFilter, setOnlySeasonFilter] = useState(false);
  //   const [monthFilter, setMonthFilter] = useState("default");

  // Retrieve all the different categories to display in the filtered search.
  const all_different_categories = Array.from(
    new Set(allRecettesData.map((recette) => recette.category))
  );

  // Retrieve all the different labels to display in the filtered search.
  const all_different_tastes = Array.from(
    new Set(allRecettesData.map((recette) => recette.tastes).flat())
  );

  // Retrieve all the different allergenes to display in the filtered search.
  const all_different_genres = Array.from(
    new Set(allRecettesData.map((recette) => recette.genres).flat())
  );

  // Group the filtered data according to a given field.
  function group_list_based_on_field(list, groupField) {
    return list.reduce((group, product) => {
      if (groupField == "name" || groupField == "default" || !groupField) {
        const { name } = product;
        group[name[0]] = group[name[0]] ?? [];
        group[name[0]].push(product);
        return group;
      } else if (groupField == "category") {
        const { category } = product;
        group[category] = group[category] ?? [];
        group[category].push(product);
        return group;
      }
    }, {});
  }

  // Sort the groups alphabetically.
  function get_sorted_and_cleaned_groups_data(group_data) {
    var dict_to_array = [];

    for (var key in group_data) {
      if (group_data.hasOwnProperty(key)) {
        dict_to_array.push({ group_name: key, recettes: group_data[key] });
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
    setGenreFilter("default");
    setTasteFilter("default");
    setCategoryFilter("default");
    setOnTheMenuFilter(false);
    setMonthFilter("default");
    setOnNextMenuFilter(false);
    setToModifyFilter(false);
  };

  // Perform a filtered search based on the various filters inputted by the user.
  const filteredSearch = () => {
    if (
      searchString != "" ||
      categoryFilter != "default" ||
      tasteFilter != "default" ||
      genreFilter != "default" ||
      monthFilter != "default" ||
      onTheMenuFilter ||
      onNextMenuFilter ||
      toModifyFilter
    ) {
      var results = allRecettesData;
      if (searchString != "") {
        results = results.filter((recette) => {
          if (searchString === "") return allRecettesData;
          return recette.name
            .toLowerCase()
            .includes(searchString.toLowerCase());
        });
      }
      if (monthFilter != "default") {
        results = results.filter(
          (recette) => recette.season[MONTHS.indexOf(monthFilter)] == true
        );
      }
      if (categoryFilter != "default") {
        results = results.filter(
          (recette) =>
            recette.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      if (genreFilter != "default") {
        results = results.filter((recette) =>
          recette.genres.includes(genreFilter)
        );
      }
      if (tasteFilter != "default") {
        results = results.filter((recette) =>
          recette.tastes.includes(tasteFilter)
        );
      }
      if (onTheMenuFilter) {
        results = results.filter((recette) => recette.selected_for_menu);
      }
      if (onNextMenuFilter) {
        results = results.filter((recette) => recette.selected_for_next_menu);
      }
      if (toModifyFilter) {
        results = results.filter((recette) => recette.is_to_modify);
      }
      groupIngredientData(results, groupingField);
      setFilteredData(results);
    }
    setModalOpen(!modalOpen);
  };

  const showMenu = () => {
    const filtered_data = allRecettesData.filter(
      (recette) => recette.selected_for_menu
    );
    const grouped_data = filtered_data.reduce((group, recette) => {
      const { category } = recette;
      group[category] = group[category] ?? [];
      group[category].push(recette);
      return group;
    }, {});
    var menu_data = [];

    for (var key in grouped_data) {
      if (grouped_data.hasOwnProperty(key)) {
        menu_data.push({
          group_name: key,
          recettes: grouped_data[key],
        });
      }
    }
    setGroupedData(menu_data);
    setFilteredData(filtered_data);
    resetSearchFilters();
    setOnTheMenuFilter(true);
  };

  return (
    <div className="col-12 col-lg-10">
      <div className={"d-flex flex-column m-1 mb-2"}>
        <div className={"col-12 d-flex flex-row justify-content-end mb-1"}>
          <Link
            href="google.com"
            style={{ textDecoration: "none", fontSize: "24px" }}
          >
            ⚙️
          </Link>
          <CreateNewRecetteButton></CreateNewRecetteButton>
        </div>
        <div className={"d-flex flex-row"}>
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
            <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
              <div className=" modal-header d-flex flex-row justify-content-end">
                <Button type="button" onClick={() => setModalOpen(!modalOpen)}>
                  Fermer
                </Button>
              </div>
              <ModalBody>
                <form className={"d-flex flex-column"}>
                  <div className={"d-flex flex-row"}>
                    <input
                      className={"col-9 ps-2 mb-4"}
                      style={{
                        borderRadius: 10,
                        borderColor: "#6C757D",
                        height: "38px",
                      }}
                      placeholder="Par nom de recette"
                      onChange={(e) => setSearchString(e.target.value)}
                      value={searchString}
                      type="search"
                    />
                  </div>
                  <div className={"d-flex flex-row align-items-baseline"}>
                    <p style={{ fontSize: 15 }}>Par catégorie:</p>
                    <select
                      className={"btn col-6 ps-1 ms-2"}
                      style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                      }}
                      value={categoryFilter}
                    >
                      <option disabled value="default">
                        Nom de la catégorie
                      </option>
                      {all_different_categories.map((category) => (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={"d-flex flex-row align-items-baseline"}>
                    <p style={{ fontSize: 15 }}>Par goût:</p>
                    <select
                      className={"btn col-6 ps-1 ms-2"}
                      style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                      onChange={(e) => {
                        setTasteFilter(e.target.value);
                      }}
                      value={tasteFilter}
                    >
                      <option disabled value="default">
                        Nom du goût
                      </option>
                      {all_different_tastes.map((taste) => (
                        <option value={taste}>{taste}</option>
                      ))}
                    </select>
                  </div>
                  <div className={"d-flex flex-row align-items-baseline"}>
                    <p style={{ fontSize: 15 }}>Par mois de saisonnalité:</p>
                    <select
                      className={"btn col-6 ps-1 ms-2"}
                      style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
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
                  <div className={"d-flex flex-row align-items-baseline"}>
                    <p style={{ fontSize: 15 }}>Par genre:</p>
                    <select
                      className={"btn col-6 ps-1 ms-2"}
                      style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                      onChange={(e) => {
                        setGenreFilter(e.target.value);
                      }}
                      value={genreFilter}
                    >
                      <option disabled value="default">
                        Nom du genre
                      </option>
                      {all_different_genres.map((genre) => (
                        <option value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                  <div className={"d-flex flex-row align-items-baseline"}>
                    {onTheMenuFilter ? (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setOnTheMenuFilter(false)}
                        checked
                      />
                    ) : (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setOnTheMenuFilter(true)}
                      />
                    )}
                    <p style={{ fontSize: 16, marginLeft: "10px" }}>
                      Recettes à la carte
                    </p>
                  </div>
                  <div className={"d-flex flex-row align-items-baseline"}>
                    {onNextMenuFilter ? (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setOnNextMenuFilter(false)}
                        checked
                      />
                    ) : (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setOnNextMenuFilter(true)}
                      />
                    )}
                    <p style={{ fontSize: 16, marginLeft: "10px" }}>
                      Recettes à la prochaine carte
                    </p>
                  </div>
                  <div className={"d-flex flex-row align-items-baseline"}>
                    {onNextMenuFilter ? (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setToModifyFilter(false)}
                        checked
                      />
                    ) : (
                      <input
                        type="checkbox"
                        id="example_checkbox"
                        onChange={(event) => setToModifyFilter(true)}
                      />
                    )}
                    <p style={{ fontSize: 16, marginLeft: "10px" }}>
                      Recettes à modifier
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
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="button"
                  className="col-4"
                  onClick={() => filteredSearch()}
                >
                  Rechercher
                </Button>
              </ModalFooter>
            </Modal>
            <button
              className={"btn"}
              style={{ textDecorationLine: "underline", color: "#6C757D" }}
              onClick={() => showMenu()}
            >
              Afficher la carte
            </button>
          </div>
          <div className={"col-7 d-flex flex-row justify-content-end"}>
            <button
              className={"btn"}
              style={{ textDecorationLine: "underline", color: "#6C757D" }}
              onClick={() => {
                setGroupedData(
                  get_initial_data_grouped_and_sorted(allRecettesData)
                );
                setFilteredData(allRecettesData);
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
            </select>
          </div>
        </div>
      </div>
      {groupedData.length > 0 ? (
        <div>
          {groupedData.map((group) => (
            <div>
              <p
                style={{
                  background: "#CDCCCD",
                  paddingLeft: "10px",
                  marginTop: "15px",
                }}
              >
                {group.group_name}
              </p>
              {group.recettes.map((recette) => (
                <RecetteListItem
                  recette={recette}
                  key={recette.id}
                ></RecetteListItem>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className={"d-flex flex-row justify-content-center"}>
          <p>
            Aucune recette ne correspond à cette recherche. Si vous n'avez pas
            effectué de recherche, merci de vérifier votre connexion internet
          </p>
        </div>
      )}
    </div>
  );
}
